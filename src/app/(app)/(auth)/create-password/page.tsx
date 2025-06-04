import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import CreatePassword from './_components/create-password-form'

export default async function CreatePasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const { token } = await searchParams

  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center">Create Password</CardTitle>
      </CardHeader>
      <CardContent>
        <CreatePassword token={token} />
      </CardContent>
    </Card>
  )
}
