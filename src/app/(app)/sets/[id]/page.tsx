export default async function Set({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return <>param id: {id}</>
}
