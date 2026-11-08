export function env(key: string, fallback?: string): string {
  const value = process.env[key]
  if (value !== undefined && value !== '') return value
  if (fallback !== undefined) return fallback
  throw new Error(`Missing environment variable: ${key}`)
}

export function envList(key: string, fallback?: string): string[] {
  return env(key, fallback)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
}
