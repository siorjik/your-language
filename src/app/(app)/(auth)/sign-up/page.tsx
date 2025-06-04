import SignUpForm from '@/components/forms/sign-up-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUp() {
  return (
    <Card className="max-w-[450px] w-[100%] py-5 md:px-5 border-transparent bg-secondary/10 shadow-xl">
      <CardHeader>
        <CardTitle className="text-center">Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
    </Card>
  )
}
