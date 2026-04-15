export function useApi() {
  const config = useRuntimeConfig()

  async function $api<T>(path: string, options?: Record<string, unknown>): Promise<T> {
    return await $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
    })
  }

  return { $api }
}
