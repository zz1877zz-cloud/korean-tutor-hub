type QueryError = {
  message?: string
  code?: string
  name?: string
}

export function queryFailureDetails(error: unknown) {
  const err = (error ?? {}) as QueryError
  const message =
    typeof err.message === "string" && err.message.trim()
      ? err.message.trim().slice(0, 300)
      : error instanceof Error
        ? error.message.slice(0, 300)
        : "unknown"
  const code = typeof err.code === "string" ? err.code.slice(0, 40) : ""
  return { message, code }
}

export function logQueryFailure(scope: string, error: unknown) {
  const details = queryFailureDetails(error)
  console.error(`[kth] ${scope} failed`, details)
  return details
}
