export function normalizeApiError(error: unknown): string | null {
  if (error instanceof Error) {
    if (error.name === 'AbortError') return null
    return error.message
  }
  return 'Unknown error'
}

export function isFetchSuccess<T>(response: any): response is { success: true; data: T } {
  return response?.success === true
}

export async function handleFetchResponse<T>(
  response: Response,
  signal?: AbortSignal
): Promise<T> {
  if (signal?.aborted) {
    throw new Error('AbortError')
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()

  if (signal?.aborted) {
    throw new Error('AbortError')
  }

  if (!result.success) {
    throw new Error(result.error || 'API request failed')
  }

  return result.data
}
