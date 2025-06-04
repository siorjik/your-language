import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import RecoverPassword from './_components/recover-password-form'

export default async function RecoverPasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams

  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center">Recover Password</CardTitle>
      </CardHeader>
      <CardContent>
        <RecoverPassword token={token} />
      </CardContent>
    </Card>
  )
}
