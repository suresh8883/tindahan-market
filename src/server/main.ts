import { createReadStream, existsSync } from 'node:fs';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import path from 'node:path';
import { LOCALES, type Locale } from '../i18n/catalogue';
import { cartPage, cataloguePage, checkoutPage, confirmationPage, qrPage, walletPage } from './pages';
import { checkSandboxToken, createOrder, walletCallbackSignature, type OrderRequest } from './payments';
import { quote, type QuoteRequest } from './vouchers/engine';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '127.0.0.1';
const PUBLIC_DIR = process.env.TINDAHAN_PUBLIC_DIR ?? path.resolve(__dirname, '..', 'public');

const STATIC_TYPES: Record<string, string> = {
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
};

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

function sendHtml(res: ServerResponse, html: string, headers: Record<string, string> = {}): void {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...headers });
  res.end(html);
}

function redirect(res: ServerResponse, location: string): void {
  res.writeHead(302, { location, 'cache-control': 'no-store' });
  res.end();
}

async function readJson<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}') as T;
}

/** `?lang=` wins and is remembered in a cookie; otherwise the cookie; otherwise English. */
function resolveLocale(req: IncomingMessage, url: URL): { locale: Locale; headers: Record<string, string> } {
  const requested = url.searchParams.get('lang');
  if (requested && (LOCALES as readonly string[]).includes(requested)) {
    return {
      locale: requested as Locale,
      headers: { 'set-cookie': `tindahan_locale=${requested}; Path=/; SameSite=Lax` },
    };
  }
  const cookie = /(?:^|;\s*)tindahan_locale=(\w+)/.exec(req.headers.cookie ?? '')?.[1];
  const locale = (LOCALES as readonly string[]).includes(cookie ?? '') ? (cookie as Locale) : 'en';
  return { locale, headers: {} };
}

async function handleApi(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  if (url.pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
  } else if (url.pathname === '/api/quote' && req.method === 'POST') {
    sendJson(res, 200, quote(await readJson<QuoteRequest>(req)));
  } else if (url.pathname === '/api/orders' && req.method === 'POST') {
    sendJson(res, 201, createOrder(await readJson<OrderRequest>(req)));
  } else if (url.pathname === '/api/pay/wallet/callback') {
    const ref = url.searchParams.get('ref') ?? '';
    if (url.searchParams.get('sig') !== walletCallbackSignature(ref)) {
      sendJson(res, 400, { error: 'bad_signature' });
    } else if (url.searchParams.get('status') === 'approved') {
      redirect(res, `/order/confirmation?${new URLSearchParams({ ref, status: 'paid' })}`);
    } else {
      redirect(res, '/checkout?walletCancelled=1');
    }
  } else if (url.pathname === '/api/wallet/sandbox/preauth' && req.method === 'POST') {
    const check = checkSandboxToken(req.headers.authorization);
    if (check.ok) {
      console.log('[wallet-sandbox] 200 preauth ok');
      sendJson(res, 200, { status: 'authorised' });
    } else {
      console.error(`[wallet-sandbox] 401 preauth rejected: sandbox token ${check.reason}`);
      sendJson(res, 401, { error: 'unauthorized', detail: `sandbox token ${check.reason}` });
    }
  } else {
    sendJson(res, 404, { error: 'not_found' });
  }
}

function handlePage(req: IncomingMessage, res: ServerResponse, url: URL): void {
  const { locale, headers } = resolveLocale(req, url);
  switch (url.pathname) {
    case '/':
      return sendHtml(res, cataloguePage(locale), headers);
    case '/cart':
      return sendHtml(res, cartPage(locale), headers);
    case '/checkout':
      return sendHtml(res, checkoutPage(locale, url.searchParams.has('walletCancelled')), headers);
    case '/mock-wallet/authorize': {
      const ref = url.searchParams.get('ref') ?? '';
      const amount = Number(url.searchParams.get('amount') ?? 0);
      return sendHtml(res, walletPage(locale, ref, amount, walletCallbackSignature(ref)), headers);
    }
    case '/pay/qr':
      return sendHtml(
        res,
        qrPage(locale, url.searchParams.get('ref') ?? '', Number(url.searchParams.get('amount') ?? 0)),
        headers,
      );
    case '/order/confirmation':
      return sendHtml(res, confirmationPage(locale), headers);
    default:
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
  }
}

function handleStatic(res: ServerResponse, url: URL): void {
  const file = path.join(PUBLIC_DIR, path.basename(url.pathname));
  const type = STATIC_TYPES[path.extname(file)];
  if (!type || !existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store' });
  createReadStream(file).pipe(res);
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const run = async (): Promise<void> => {
    if (url.pathname.startsWith('/api/')) await handleApi(req, res, url);
    else if (url.pathname.startsWith('/static/')) handleStatic(res, url);
    else handlePage(req, res, url);
  };
  run().catch((error: unknown) => {
    console.error('[server] request failed', error);
    sendJson(res, 400, { error: 'bad_request' });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Tindahan Market listening on http://${HOST}:${PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
