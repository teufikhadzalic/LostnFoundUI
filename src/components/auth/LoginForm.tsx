"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/hooks"
import { isValidEmail } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Mail, Lock, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const router = useRouter()
  const { login, isLoading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: "petugas.officer@ui.ac.id",
    password: "password123",
  })
  const [validationError, setValidationError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setValidationError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!isValidEmail(formData.email)) {
      setValidationError("Email tidak valid")
      return
    }

    if (formData.password.length < 6) {
      setValidationError("Password minimal 6 karakter")
      return
    }

    try {
      await login(formData.email, formData.password)
      router.push("/dashboard/feed")
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : "Login gagal")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Masuk ke Akun Anda</CardTitle>
        <CardDescription>Gunakan email UI atau SSO untuk mengakses platform</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || validationError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || validationError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email UI
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@ui.ac.id"
                value={formData.email}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">atau</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full bg-transparent" size="lg" disabled={isLoading}>
            Masuk dengan SSO UI
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Belum punya akun? </span>
            <Link href="/auth/register" className="font-medium text-primary hover:underline">
              Daftar di sini
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
