import RecoverPassword from './_components/recover-password-form'

export default async function RecoverPasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams

  return (
    <>
      <h2 className="title">Recover Password</h2>
      <RecoverPassword token={token} />
    </>
  )
}
