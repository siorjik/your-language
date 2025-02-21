import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import AccForm from './_components/acc-form'
import PassForm from './_components/pass-form'

export default function Profile() {
  return (
    <>
      <Tabs defaultValue="acc">
        <TabsList>
          <TabsTrigger value="acc">Account</TabsTrigger>
          <TabsTrigger value="pass">Password</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
          <TabsTrigger value="two-fa">Two-Factor Authentication</TabsTrigger>
        </TabsList>
        <TabsContent value="acc">
          <div className="mt-10">
            <AccForm />
          </div>
        </TabsContent>
        <TabsContent value="pass">
          <div className="mt-10">
            <PassForm />
          </div>
        </TabsContent>
        <TabsContent value="image">
          <div className="mt-10">Image</div>
        </TabsContent>
        <TabsContent value="two-fa">
          <div className="mt-10">Two-Fa</div>
        </TabsContent>
      </Tabs>
    </>
  )
}
