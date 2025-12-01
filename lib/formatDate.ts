export function formatDateTime(input: string | number | Date) {
  const d = new Date(input)
  if (isNaN(d.getTime())) return "-"

  // Indonesian locale with short month and full time including seconds
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(d)
}

export function formatTimeOnly(input: string | number | Date) {
  const d = new Date(input)
  if (isNaN(d.getTime())) return "-"
  return new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(d)
}
