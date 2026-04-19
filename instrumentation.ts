export async function register() {
  // Validate required env vars at startup — fails loudly before any request
  await import('./lib/env')
}
