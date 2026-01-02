"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, CheckCircle2, Loader2 } from "lucide-react"
import { categories, countries } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"

export function SubmitChannelForm() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    link: "",
    description: "",
    country: "",
    email: "",
    creator_name: "",
    followers: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const countryData = countries.find((c) => c.id === formData.country)

    const { error: insertError } = await supabase.from("channels").insert({
      name: formData.name,
      category: formData.category,
      link: formData.link,
      description: formData.description,
      country: formData.country,
      country_flag: countryData?.flag || "🌎",
      submitted_by_email: formData.email || null,
      creator_name: formData.creator_name || null,
      followers: formData.followers ? Number.parseInt(formData.followers) : null,
      status: "pending",
      rating: 0,
      total_votes: 0,
      verified: false,
    })

    setIsLoading(false)

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Este canal ya ha sido enviado anteriormente.")
      } else {
        setError("Error al enviar el canal. Intenta de nuevo.")
      }
      return
    }

    setSuccess(true)
    setFormData({
      name: "",
      category: "",
      link: "",
      description: "",
      country: "",
      email: "",
      creator_name: "",
      followers: "",
    })

    setTimeout(() => {
      setOpen(false)
      setSuccess(false)
    }, 2000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Enviar Canal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enviar un Canal</DialogTitle>
          <DialogDescription>
            Comparte un canal de WhatsApp con la comunidad. Será revisado antes de publicarse.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <p className="text-center text-lg font-medium">¡Canal enviado correctamente!</p>
            <p className="text-center text-muted-foreground text-sm">Lo revisaremos pronto.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Canal *</Label>
              <Input
                id="name"
                placeholder="Ej: Memes Latinos"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Enlace del Canal *</Label>
              <Input
                id="link"
                placeholder="https://whatsapp.com/channel/..."
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
                type="url"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>País *</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) => setFormData({ ...formData, country: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries
                      .filter((c) => c.id !== "all")
                      .map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="creator_name">Nombre del Creador</Label>
                <Input
                  id="creator_name"
                  placeholder="Tu nombre o alias"
                  value={formData.creator_name}
                  onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followers">Seguidores (aprox.)</Label>
                <Input
                  id="followers"
                  type="number"
                  placeholder="10000"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                placeholder="Describe brevemente de qué trata el canal..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Tu Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Para notificarte cuando se apruebe"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Canal"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
