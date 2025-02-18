type ObjectType = { [k: string]: string | number | boolean | File | ObjectType[] }
type RequestParams = { url: string; method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'; body?: ObjectType | undefined }

export default async <T>({ url, method = 'GET', body }: RequestParams): Promise<T> => {
  try {
    const resp = await fetch(url, { method, body: JSON.stringify(body) })

    const res = await resp.json()

    if (res.error) throw res

    return res
  } catch (error) {
    throw error
  }
}
