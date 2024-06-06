export function abortSignal(ms?: number) {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms || 30000)
  return controller.signal
}
