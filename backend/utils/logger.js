export default {
  info: (message) => console.log(`[INFO] ${new Date().toISOString()} — ${message}`),
  error: (message, details = "") => console.error(`[ERROR] ${new Date().toISOString()} — ${message}`, details),
  warn: (message) => console.warn(`[WARN] ${new Date().toISOString()} — ${message}`),
}
