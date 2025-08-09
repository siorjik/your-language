type ObjectType = { [k: string]: string | number | boolean | File | ObjectType[] }
type RequestParams = {
  url: string
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'
  body?: ObjectType | undefined
  headers?: null | Headers
}

export default async <T>({ url, method = 'GET', body, headers }: RequestParams): Promise<T> => {
  const heads = headers ? { ...Object.fromEntries(headers) } : {}
  console.log('url in apiRequestService - ', url)
  if (Object.keys(heads).length) delete heads['content-length']

  try {
    const resp = await fetch(url, { method, body: JSON.stringify(body), headers: heads })

    const res = await resp.json()

    if (res.error) throw res

    return res
  } catch (error) {
    throw error
  }
}
