export function abortSignal(ms?: number) {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms || 60000)
  return controller.signal
}
