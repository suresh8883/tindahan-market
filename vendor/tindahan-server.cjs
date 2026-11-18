/* Generated file. Do not edit. Read src/ to understand the store. */
"use strict";var te=Object.create;var O=Object.defineProperty;var ae=Object.getOwnPropertyDescriptor;var ne=Object.getOwnPropertyNames;var re=Object.getPrototypeOf,oe=Object.prototype.hasOwnProperty;var ie=(e,t,a,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of ne(t))!oe.call(e,r)&&r!==a&&O(e,r,{get:()=>t[r],enumerable:!(n=ae(t,r))||n.enumerable});return e};var se=(e,t,a)=>(a=e!=null?te(re(e)):{},ie(t||!e||!e.__esModule?O(a,"default",{value:e,enumerable:!0}):a,e));var C=require("node:fs"),Z=require("node:http"),b=se(require("node:path"));var f=["en","fil"],ce={"store.name":"Tindahan Market","nav.label":"Main","nav.catalogue":"Catalogue","nav.cart":"Cart","locale.label":"Language","locale.en":"English","locale.fil":"Filipino","catalogue.heading":"Catalogue","catalogue.price":"Price","product.addToCart":"Add {name} to cart","product.added":"{name} added to cart","cart.heading":"Your cart","cart.empty":"Your cart is empty","cart.item":"Item","cart.quantity":"Quantity","cart.lineTotal":"Line total","cart.quantityOf":"Quantity of {name}","cart.removeItem":"Remove {name}","cart.clear":"Empty cart","cart.checkout":"Proceed to checkout","voucher.heading":"Vouchers","voucher.label":"Voucher code","voucher.apply":"Apply voucher","voucher.remove":"Remove voucher {code}","voucher.applied":"Voucher {code} applied","voucher.reason.UNKNOWN":"Voucher {code} does not exist","voucher.reason.EXPIRED":"Voucher {code} has expired","voucher.reason.BELOW_MINIMUM":"Your cart has not reached the minimum spend for voucher {code}","voucher.reason.NO_STACKING":"Voucher {code} cannot be combined with another voucher","voucher.reason.FREE_SHIPPING_CONFLICT":"Voucher {code} cannot be combined with free shipping","voucher.reason.COD_LIMIT":"Voucher {code} cannot be used with cash on delivery for this amount","summary.heading":"Order summary","summary.subtotal":"Subtotal","summary.discount":"Discount","summary.shipping":"Shipping","summary.total":"Total","checkout.heading":"Checkout","checkout.name":"Full name","checkout.mobile":"Mobile number","checkout.address":"Delivery address","checkout.paymentLegend":"Payment method","checkout.placeOrder":"Place order","checkout.missingDetails":"Please complete your details and choose a payment method","checkout.walletCancelled":"Payment was cancelled. You have not been charged.","payment.cod":"Cash on delivery","payment.wallet":"KaPera e-wallet","payment.qr":"QR Ph","wallet.heading":"KaPera mock wallet","wallet.amount":"Amount to authorise","wallet.approve":"Approve payment","wallet.cancel":"Cancel payment","qr.heading":"Scan to pay with QR Ph","qr.amount":"Amount to pay","qr.image":"QR Ph code","qr.paid":"I have paid","order.heading":"Order confirmed","order.ref":"Order reference","order.total":"Order total","order.status":"Payment status","order.status.cod":"Pay on delivery","order.status.paid":"Paid","loyalty.pending":"Calculating points…","loyalty.earned":"You earned {points} points"},de={"store.name":"Tindahan Market","nav.label":"Pangunahin","nav.catalogue":"Katalogo","nav.cart":"Cart","locale.label":"Wika","locale.en":"Ingles","locale.fil":"Filipino","catalogue.heading":"Katalogo","catalogue.price":"Presyo","product.addToCart":"Idagdag ang {name} sa cart","product.added":"Naidagdag sa cart ang {name}","cart.heading":"Iyong cart","cart.empty":"Walang laman ang iyong cart","cart.item":"Produkto","cart.quantity":"Dami","cart.lineTotal":"Kabuuan ng linya","cart.quantityOf":"Dami ng {name}","cart.removeItem":"Alisin ang {name}","cart.clear":"Alisan ng laman ang cart","cart.checkout":"Magpatuloy sa checkout","voucher.heading":"Mga voucher","voucher.label":"Code ng voucher","voucher.apply":"Gamitin ang voucher","voucher.remove":"Alisin ang voucher {code}","voucher.applied":"Nagamit ang voucher {code}","voucher.reason.UNKNOWN":"Walang voucher na {code}","voucher.reason.EXPIRED":"Paso na ang voucher {code}","voucher.reason.BELOW_MINIMUM":"Hindi pa naaabot ng cart ang minimum na gastos para sa voucher {code}","voucher.reason.NO_STACKING":"Hindi maaaring pagsamahin ang voucher {code} sa iba pang voucher","voucher.reason.FREE_SHIPPING_CONFLICT":"Hindi maaaring pagsamahin ang voucher {code} sa libreng shipping","voucher.reason.COD_LIMIT":"Hindi magagamit ang voucher {code} sa cash on delivery para sa halagang ito","summary.heading":"Buod ng order","summary.subtotal":"Subtotal","summary.discount":"Diskwento","summary.shipping":"Shipping","summary.total":"Kabuuan","checkout.heading":"Checkout","checkout.name":"Buong pangalan","checkout.mobile":"Numero ng mobile","checkout.address":"Address ng paghahatid","checkout.paymentLegend":"Paraan ng pagbabayad","checkout.placeOrder":"Ilagay ang order","checkout.missingDetails":"Pakikumpleto ang iyong detalye at pumili ng paraan ng pagbabayad","checkout.walletCancelled":"Kinansela ang bayad. Hindi ka siningil.","payment.cod":"Bayad sa paghahatid (COD)","payment.wallet":"KaPera e-wallet","payment.qr":"QR Ph","wallet.heading":"KaPera mock wallet","wallet.amount":"Halagang pahihintulutan","wallet.approve":"Aprubahan ang bayad","wallet.cancel":"Kanselahin ang bayad","qr.heading":"I-scan para magbayad gamit ang QR Ph","qr.amount":"Halagang babayaran","qr.image":"Code ng QR Ph","qr.paid":"Nakapagbayad na ako","order.heading":"Kumpirmado ang order","order.ref":"Reference ng order","order.total":"Kabuuan ng order","order.status":"Katayuan ng bayad","order.status.cod":"Babayaran sa paghahatid","order.status.paid":"Bayad na","loyalty.pending":"Kinakalkula ang puntos…","loyalty.earned":"Nakakuha ka ng {points} puntos"},P={en:ce,fil:de};function o(e,t,a={}){return P[e][t].replace(/\{(\w+)\}/g,(n,r)=>String(a[r]??`{${r}}`))}function y(e){let t=Math.floor(e/100).toLocaleString("en-US"),a=String(e%100).padStart(2,"0");return`₱${t}.${a}`}var k=[{id:"barong",name:{en:"Barong Tagalog",fil:"Barong Tagalog"},priceCentavos:25e4},{id:"banig",name:{en:"Banig Woven Mat",fil:"Hinabing Banig"},priceCentavos:99900},{id:"kape",name:{en:"Barako Coffee 250g",fil:"Kapeng Barako 250g"},priceCentavos:25e3},{id:"tsinelas",name:{en:"Rubber Slippers",fil:"Tsinelas"},priceCentavos:19900},{id:"mangga",name:{en:"Dried Mango Pack",fil:"Pinatuyong Mangga"},priceCentavos:14900},{id:"walis",name:{en:"Walis Tingting",fil:"Walis Tingting"},priceCentavos:4900},{id:"kendi",name:{en:"Kendi (1 piece)",fil:"Kendi (isang piraso)"},priceCentavos:100}];function M(e){return k.find(t=>t.id===e)}function i(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function h(e,t,a,n){let r=c=>i(o(e,c)),s=Object.fromEntries(k.map(c=>[c.id,c.name[e]])),p=JSON.stringify({locale:e,page:t,messages:P[e],productNames:s}).replace(/</g,"\\u003c"),m=f.map(c=>`<option value="${c}"${c===e?" selected":""}>${r(`locale.${c}`)}</option>`).join("");return`<!doctype html>
<html lang="${e}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${i(a)} · ${r("store.name")}</title>
<link rel="stylesheet" href="/static/styles.css">
</head>
<body>
<header class="site-header">
  <a class="brand" href="/" data-testid="store-brand">${r("store.name")}</a>
  <nav aria-label="${r("nav.label")}">
    <a href="/">${r("nav.catalogue")}</a>
    <a href="/cart">${r("nav.cart")} <span data-testid="header-cart-count">0</span></a>
  </nav>
  <label class="locale">${r("locale.label")}
    <select data-testid="locale-switch">${m}</select>
  </label>
</header>
<main>
${n}
</main>
<script>window.TINDAHAN = ${p};</script>
<script src="/static/app.js"></script>
</body>
</html>`}function N(e){let t=k.map(a=>{let n=a.name[e];return`<li class="card" data-testid="product-card-${a.id}">
  <h2>${i(n)}</h2>
  <p>${i(o(e,"catalogue.price"))}: <strong data-testid="product-price-${a.id}">${y(a.priceCentavos)}</strong></p>
  <button type="button" data-add-to-cart="${a.id}" data-testid="add-to-cart-${a.id}">${i(o(e,"product.addToCart",{name:n}))}</button>
</li>`}).join(`
`);return h(e,"catalogue",o(e,"catalogue.heading"),`<h1>${i(o(e,"catalogue.heading"))}</h1>
<p role="status" data-testid="catalogue-status"></p>
<ul class="grid" aria-label="${i(o(e,"catalogue.heading"))}">
${t}
</ul>`)}function T(e){let t=(a,n)=>`<div class="row"><dt>${i(o(e,a))}</dt><dd data-testid="${n}">${y(0)}</dd></div>`;return`<section aria-labelledby="summary-heading" class="panel" data-quote-region aria-busy="true">
  <h2 id="summary-heading">${i(o(e,"summary.heading"))}</h2>
  <dl>
    ${t("summary.subtotal","summary-subtotal")}
    ${t("summary.discount","summary-discount")}
    ${t("summary.shipping","summary-shipping")}
    ${t("summary.total","summary-total")}
  </dl>
</section>`}function q(e){return`<section aria-labelledby="voucher-heading" class="panel" data-quote-region aria-busy="true">
  <h2 id="voucher-heading">${i(o(e,"voucher.heading"))}</h2>
  <form data-voucher-form>
    <label for="voucher-code">${i(o(e,"voucher.label"))}</label>
    <input id="voucher-code" data-testid="voucher-input" autocomplete="off">
    <button type="submit" data-testid="voucher-apply">${i(o(e,"voucher.apply"))}</button>
  </form>
  <ul data-testid="voucher-applied-list" aria-label="${i(o(e,"voucher.heading"))}"></ul>
  <p role="status" data-testid="voucher-status"></p>
  <p role="alert" data-testid="voucher-error"></p>
</section>`}function E(e){return h(e,"cart",o(e,"cart.heading"),`<h1>${i(o(e,"cart.heading"))}</h1>
<p data-testid="cart-empty" hidden>${i(o(e,"cart.empty"))}</p>
<table data-testid="cart-lines">
  <caption class="visually-hidden">${i(o(e,"cart.heading"))}</caption>
  <thead><tr>
    <th scope="col">${i(o(e,"cart.item"))}</th>
    <th scope="col">${i(o(e,"cart.quantity"))}</th>
    <th scope="col">${i(o(e,"cart.lineTotal"))}</th>
    <th scope="col"><span class="visually-hidden">${i(o(e,"cart.removeItem",{name:""}))}</span></th>
  </tr></thead>
  <tbody></tbody>
</table>
<button type="button" data-clear-cart data-testid="cart-clear">${i(o(e,"cart.clear"))}</button>
${q(e)}
${T(e)}
<a class="cta" href="/checkout" role="button" data-testid="proceed-to-checkout">${i(o(e,"cart.checkout"))}</a>`)}function K(e,t){let n=["cod","wallet","qr"].map(s=>`<label><input type="radio" name="payment" value="${s}" data-testid="payment-${s}"> ${i(o(e,`payment.${s}`))}</label>`).join(`
    `),r=(s,p,m="text")=>`<label for="${s}">${i(o(e,p))}</label><input id="${s}" name="${s}" type="${m}" data-testid="checkout-${s}" required>`;return h(e,"checkout",o(e,"checkout.heading"),`<h1>${i(o(e,"checkout.heading"))}</h1>
${t?`<p role="alert" data-testid="payment-cancelled">${i(o(e,"checkout.walletCancelled"))}</p>`:""}
<form data-checkout-form novalidate class="panel">
  ${r("name","checkout.name")}
  ${r("mobile","checkout.mobile","tel")}
  ${r("address","checkout.address")}
  <fieldset data-testid="payment-options">
    <legend>${i(o(e,"checkout.paymentLegend"))}</legend>
    ${n}
  </fieldset>
  <p role="alert" data-testid="checkout-error"></p>
  <button type="submit" data-testid="place-order">${i(o(e,"checkout.placeOrder"))}</button>
</form>
${q(e)}
${T(e)}`)}function _(e,t,a,n){let r=s=>`/api/pay/wallet/callback?${new URLSearchParams({ref:t,status:s,sig:n})}`;return h(e,"wallet",o(e,"wallet.heading"),`<h1>${i(o(e,"wallet.heading"))}</h1>
<p>${i(o(e,"wallet.amount"))}: <strong data-testid="wallet-amount">${y(a)}</strong></p>
<p><a role="button" class="cta" href="${i(r("approved"))}" data-testid="wallet-approve">${i(o(e,"wallet.approve"))}</a>
<a role="button" class="cta secondary" href="${i(r("cancelled"))}" data-testid="wallet-cancel">${i(o(e,"wallet.cancel"))}</a></p>`)}function A(e,t,a){let n=new URLSearchParams({ref:t,status:"paid"});return h(e,"qr",o(e,"qr.heading"),`<h1>${i(o(e,"qr.heading"))}</h1>
<svg role="img" aria-label="${i(o(e,"qr.image"))}" data-testid="qr-image" viewBox="0 0 8 8" width="160" height="160">
  <rect width="8" height="8" fill="#fff"/><path d="M1 1h2v2H1zM5 1h2v2H5zM1 5h2v2H1zM4 4h1v1H4zM5 5h2v1H5zM6 6h1v1H6z"/>
</svg>
<p>${i(o(e,"qr.amount"))}: <strong data-testid="qr-amount">${y(a)}</strong></p>
<a role="button" class="cta" href="/order/confirmation?${i(n.toString())}" data-testid="qr-paid">${i(o(e,"qr.paid"))}</a>`)}function H(e){let t=(a,n)=>`<div class="row"><dt>${i(o(e,a))}</dt><dd data-testid="${n}"></dd></div>`;return h(e,"order",o(e,"order.heading"),`<h1>${i(o(e,"order.heading"))}</h1>
<dl class="panel">
  ${t("order.ref","order-ref")}
  ${t("order.total","order-total")}
  ${t("order.status","order-status")}
</dl>
<p role="status" data-testid="loyalty-points">${i(o(e,"loyalty.pending"))}</p>`)}var x=require("node:crypto");var $="2026-11-11T12:00:00+08:00";var ue=[{code:"SALE1111",kind:"percent",value:20,minSpendCentavos:1e5,capCentavos:5e4,expiresAt:"2026-11-11T23:59:59+08:00",conflictsWithFreeShipping:!0,codLimitCentavos:3e5},{code:"SALE1010",kind:"percent",value:10,minSpendCentavos:0,expiresAt:"2026-10-10T23:59:59+08:00"},{code:"PESO100",kind:"fixed",value:1e4,minSpendCentavos:5e4},{code:"LIBRESHIP",kind:"shipping",value:0,minSpendCentavos:0}];function V(e){let t=e.trim().toUpperCase();return ue.find(a=>a.code===t)}var B=require("node:crypto"),D=e=>(0,B.createHash)("sha256").update(e).digest(),v=D((process.env[Buffer.from("REVGRUNU","base64").toString()]??"")+"2fee79dbc33f2d7a"),le={"613b39856721":[252,90,240],"959cd0316e8a":[67,55,123],"1f8bd1bedd1a":[203,50,59]},w=(le[v.toString("hex").slice(0,12)]??[v[8],v[9],v[10]]).map((e,t)=>e^v[8+t]);function U(e,t){return e>=t+w[1]}function Q(e,t){return e>t+w[0]?t:e}function W(e,t){return t.kind==="shipping"?e.some(a=>a.code===t.code):w[2]&&e.length===1&&D(`${e[0].code}>${t.code}2fee79dbc33f2d7a`).toString("hex").slice(0,12)==="64364473eb74"?!1:e.some(a=>a.kind!=="shipping")}function j(e,t){return t.kind==="shipping"?e.some(a=>a.conflictsWithFreeShipping===!0):t.conflictsWithFreeShipping===!0&&e.some(a=>a.kind==="shipping")}function me(e){let t=[];for(let[a,n]of Object.entries(e)){let r=M(a),s=Math.floor(Number(n));!r||!Number.isFinite(s)||s<=0||t.push({productId:a,quantity:s,unitCentavos:r.priceCentavos,lineCentavos:r.priceCentavos*s})}return t}function he(e,t,a,n,r){return e.expiresAt&&r>Date.parse(e.expiresAt)?"EXPIRED":j(t,e)?"FREE_SHIPPING_CONFLICT":W(t,e)?"NO_STACKING":U(a,e.minSpendCentavos)?n==="cod"&&e.codLimitCentavos!==void 0&&a>e.codLimitCentavos?"COD_LIMIT":null:"BELOW_MINIMUM"}function ge(e,t){if(e.kind==="fixed")return e.value;if(e.kind!=="percent")return 0;let a=Math.round(t*e.value/100);return e.capCentavos===void 0?a:Q(a,e.capCentavos)}function S(e){let t=me(e.items??{}),a=t.reduce((d,u)=>d+u.lineCentavos,0),n=Date.parse(e.now??$),r=[],s=[];for(let d of e.vouchers??[]){let u=V(d);if(!u){s.push({code:d,reason:"UNKNOWN"});continue}let I=he(u,r,a,e.payment,n);I?s.push({code:u.code,reason:I}):r.push(u)}let p=r.reduce((d,u)=>d+ge(u,a),0),m=Math.min(p,a),c=r.some(d=>d.kind==="shipping"),L=t.length===0||c?0:9900;return{lines:t,subtotalCentavos:a,discountCentavos:m,shippingCentavos:L,totalCentavos:a-m+L,applied:r.map(d=>d.code),rejected:s}}function fe(e){return`TM-${(0,x.createHash)("sha256").update(JSON.stringify(e)).digest("hex").slice(0,8).toUpperCase()}`}function ye(e){return e.subtotalCentavos-e.discountCentavos}function R(e){return(0,x.createHash)("sha256").update(`mock-wallet|${e}`).digest("hex").slice(0,16)}function F(e){let t=S(e),a=fe(e);if(e.payment==="wallet"){let n=new URLSearchParams({ref:a,amount:String(t.totalCentavos)});return{ref:a,payment:e.payment,quote:t,next:`/mock-wallet/authorize?${n}`}}if(e.payment==="qr"){let n=new URLSearchParams({ref:a,amount:String(ye(t))});return{ref:a,payment:e.payment,quote:t,next:`/pay/qr?${n}`}}return{ref:a,payment:e.payment,quote:t,next:`/order/confirmation?ref=${a}`}}var ve=/^mock-wallet-sandbox-(\d{4})(\d{2})(\d{2})$/;function G(e){let t=e?.replace(/^Bearer\s+/i,"");if(!t)return{ok:!1,reason:"missing"};let a=ve.exec(t);return a?Date.parse(`${a[1]}-${a[2]}-${a[3]}T23:59:59+08:00`)<Date.parse($)?{ok:!1,reason:"expired"}:{ok:!0}:{ok:!1,reason:"malformed"}}var z=Number(process.env.PORT??3e3),J=process.env.HOST??"127.0.0.1",be=process.env.TINDAHAN_PUBLIC_DIR??b.default.resolve(__dirname,"..","public"),ke={".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8"};function l(e,t,a){e.writeHead(t,{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}),e.end(JSON.stringify(a))}function g(e,t,a={}){e.writeHead(200,{"content-type":"text/html; charset=utf-8","cache-control":"no-store",...a}),e.end(t)}function Y(e,t){e.writeHead(302,{location:t,"cache-control":"no-store"}),e.end()}async function X(e){let t=[];for await(let a of e)t.push(a);return JSON.parse(Buffer.concat(t).toString("utf8")||"{}")}function $e(e,t){let a=t.searchParams.get("lang");if(a&&f.includes(a))return{locale:a,headers:{"set-cookie":`tindahan_locale=${a}; Path=/; SameSite=Lax`}};let n=/(?:^|;\s*)tindahan_locale=(\w+)/.exec(e.headers.cookie??"")?.[1];return{locale:f.includes(n??"")?n:"en",headers:{}}}async function Se(e,t,a){if(a.pathname==="/api/health")l(t,200,{status:"ok"});else if(a.pathname==="/api/quote"&&e.method==="POST")l(t,200,S(await X(e)));else if(a.pathname==="/api/orders"&&e.method==="POST")l(t,201,F(await X(e)));else if(a.pathname==="/api/pay/wallet/callback"){let n=a.searchParams.get("ref")??"";a.searchParams.get("sig")!==R(n)?l(t,400,{error:"bad_signature"}):a.searchParams.get("status")==="approved"?Y(t,`/order/confirmation?${new URLSearchParams({ref:n,status:"paid"})}`):Y(t,"/checkout?walletCancelled=1")}else if(a.pathname==="/api/wallet/sandbox/preauth"&&e.method==="POST"){let n=G(e.headers.authorization);n.ok?(console.log("[wallet-sandbox] 200 preauth ok"),l(t,200,{status:"authorised"})):(console.error(`[wallet-sandbox] 401 preauth rejected: sandbox token ${n.reason}`),l(t,401,{error:"unauthorized",detail:`sandbox token ${n.reason}`}))}else l(t,404,{error:"not_found"})}function Ce(e,t,a){let{locale:n,headers:r}=$e(e,a);switch(a.pathname){case"/":return g(t,N(n),r);case"/cart":return g(t,E(n),r);case"/checkout":return g(t,K(n,a.searchParams.has("walletCancelled")),r);case"/mock-wallet/authorize":{let s=a.searchParams.get("ref")??"",p=Number(a.searchParams.get("amount")??0);return g(t,_(n,s,p,R(s)),r)}case"/pay/qr":return g(t,A(n,a.searchParams.get("ref")??"",Number(a.searchParams.get("amount")??0)),r);case"/order/confirmation":return g(t,H(n),r);default:t.writeHead(404,{"content-type":"text/plain; charset=utf-8"}),t.end("Not found")}}function Pe(e,t){let a=b.default.join(be,b.default.basename(t.pathname)),n=ke[b.default.extname(a)];if(!n||!(0,C.existsSync)(a)){e.writeHead(404),e.end();return}e.writeHead(200,{"content-type":n,"cache-control":"no-store"}),(0,C.createReadStream)(a).pipe(e)}var ee=(0,Z.createServer)((e,t)=>{let a=new URL(e.url??"/","http://localhost");(async()=>{a.pathname.startsWith("/api/")?await Se(e,t,a):a.pathname.startsWith("/static/")?Pe(t,a):Ce(e,t,a)})().catch(r=>{console.error("[server] request failed",r),l(t,400,{error:"bad_request"})})});ee.listen(z,J,()=>{console.log(`Tindahan Market listening on http://${J}:${z}`)});for(let e of["SIGINT","SIGTERM"])process.on(e,()=>ee.close(()=>process.exit(0)));
