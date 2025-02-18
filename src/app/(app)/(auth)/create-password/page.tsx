import CreatePassword from './_components/create-password'

export default async function CreatePasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams

  return (
    <>
      <h2 className="title">Create Password</h2>
      <CreatePassword token={token} />
    </>
  )
}
