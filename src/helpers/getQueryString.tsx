type Params = Record<string, string | Date | number | boolean | string[]>
type GetQueryParams = { currentParams?: URLSearchParams; newParams?: Params; toDeleteParams?: string[] | null }

export default ({ currentParams, newParams, toDeleteParams = null }: GetQueryParams) => {
  let q = ''
  const oldParams: Record<string, string> = {}
  let params: Params = {}

  if (!!currentParams?.size) {
    for (const [k, v] of currentParams.entries()) {
      oldParams[k] = v
    }
  }

  params = newParams ? { ...oldParams, ...newParams } : { ...oldParams }

  if (toDeleteParams) toDeleteParams.forEach((param) => delete params[param])

  for (const [k, v] of Object.entries(params)) {
    q += `${k}=${v instanceof Date ? v.toISOString() : v}&`
  }

  return q
}
