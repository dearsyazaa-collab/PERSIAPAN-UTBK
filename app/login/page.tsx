import { login } from './actions' // Hapus import signup karena tidak dipakai lagi
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type Props = {
  searchParams: Promise<{ message?: string }>
}

export default async function LoginPage(props: Props) {
  const searchParams = await props.searchParams
  const message = searchParams.message

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login Peserta</CardTitle>
          <CardDescription className="text-center">
            Masukkan Username dan Password dari Admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            
            {/* INPUT USERNAME */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username" // Name diganti jadi username
                type="text"     // Type diganti jadi text biasa
                placeholder="Contoh: peserta001"
                required
              />
            </div>

            {/* INPUT PASSWORD */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
            
            {/* ERROR MESSAGE */}
            {message && (
              <div className="text-sm font-medium text-red-500 bg-red-50 p-2 rounded border border-red-200 text-center">
                {message}
              </div>
            )}

            <div className="flex flex-col gap-2 mt-2">
              {/* HANYA ADA TOMBOL LOGIN */}
              <Button formAction={login} className="w-full bg-blue-600 hover:bg-blue-700">
                Masuk Aplikasi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}