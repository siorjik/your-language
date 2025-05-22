import CreatePassword from './_components/create-password-form'

export default async function CreatePasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams

  return (
    <>
      <h2>Create Password</h2>
      <CreatePassword token={token} />
    </>
  )
}
