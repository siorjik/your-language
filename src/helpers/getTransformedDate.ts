export default (data: Date) => {
  const index = data.toISOString().indexOf('T')

  return data.toISOString().slice(0, index)
}
