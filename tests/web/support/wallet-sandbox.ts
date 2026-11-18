/** The sandbox token comes from the environment (CI loads ci/wallet-sandbox.env). */
export function walletSandboxToken(): string {
  const token = process.env.WALLET_SANDBOX_TOKEN;
  if (!token) throw new Error('WALLET_SANDBOX_TOKEN is not set');
  return token;
}
