"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, ExternalLink, Loader2, Lock, MessageCircle, Star, Shield } from "lucide-react"
import type { Channel } from "@/lib/data"
import { categories, countries } from "@/lib/data"

const ADMIN_PASSWORD = "whatsdirectory2024"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [pendingChannels, setPendingChannels] = useState<Channel[]>([])
  const [approvedChannels, setApprovedChannels] = useState<Channel[]>([])
  const [rejectedChannels, setRejectedChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Contraseña incorrecta")
    }
  }

  const fetchChannels = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/channels")
      const data = await res.json()
      setPendingChannels(data.pending || [])
      setApprovedChannels(data.approved || [])
      setRejectedChannels(data.rejected || [])
    } catch {
      console.error("Error fetching channels")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchChannels()
    }
  }, [isAuthenticated])

  const handleAction = async (channelId: string, action: "approve" | "reject") => {
    setActionLoading(channelId)
    try {
      await fetch("/api/admin/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, action }),
      })
      await fetchChannels()
    } catch {
      console.error("Error updating channel")
    }
    setActionLoading(null)
  }

  const handleDelete = async (channelId: string) => {
    if (!confirm("¿Estás seguro de eliminar este canal?")) return
    setActionLoading(channelId)
    try {
      await fetch("/api/admin/channels", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId }),
      })
      await fetchChannels()
    } catch {
      console.error("Error deleting channel")
    }
    setActionLoading(null)
  }

  const handleSetRating = async (channelId: string, rating: number) => {
    try {
      await fetch("/api/admin/channels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, rating }),
      })
      await fetchChannels()
    } catch {
      console.error("Error updating rating")
    }
  }

  const handleToggleVerified = async (channelId: string, verified: boolean) => {
    try {
      await fetch("/api/admin/channels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelId, verified }),
      })
      await fetchChannels()
    } catch {
      console.error("Error updating verified status")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary">
                <Lock className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl">Panel de Administración</CardTitle>
            <p className="text-muted-foreground">WhatsDirectory</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa la contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const ChannelCard = ({ channel, showActions = true }: { channel: Channel; showActions?: boolean }) => {
    const category = categories.find((c) => c.id === channel.category)
    const country = countries.find((c) => c.id === channel.country)

    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{category?.icon}</span>
              <Badge variant="secondary" className="text-xs">
                {category?.name}
              </Badge>
              <span className="text-lg">{country?.flag}</span>
            </div>
            {channel.verified && <Badge className="bg-primary text-primary-foreground">Verificado</Badge>}
          </div>

          <h3 className="font-semibold text-foreground mb-1">{channel.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{channel.description}</p>

          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <a
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Ver canal
            </a>
            {channel.submitted_by_email && <span className="ml-2">Email: {channel.submitted_by_email}</span>}
          </div>

          {channel.status === "approved" && (
            <div className="flex items-center gap-4 mb-3 pb-3 border-b border-border">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Rating:</span>
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => handleSetRating(channel.id, i + 1)} className="focus:outline-none">
                    <Star
                      className={`w-4 h-4 transition-colors ${
                        i < channel.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground/30 hover:text-yellow-500/50"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button
                size="sm"
                variant={channel.verified ? "default" : "outline"}
                className="h-7 text-xs"
                onClick={() => handleToggleVerified(channel.id, !channel.verified)}
              >
                <Shield className="w-3 h-3 mr-1" />
                {channel.verified ? "Verificado" : "Verificar"}
              </Button>
            </div>
          )}

          {showActions && channel.status === "pending" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                onClick={() => handleAction(channel.id, "approve")}
                disabled={actionLoading === channel.id}
              >
                {actionLoading === channel.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Aprobar
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="flex-1"
                onClick={() => handleAction(channel.id, "reject")}
                disabled={actionLoading === channel.id}
              >
                {actionLoading === channel.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Rechazar
                  </>
                )}
              </Button>
            </div>
          )}

          {(channel.status === "approved" || channel.status === "rejected") && (
            <Button
              size="sm"
              variant="outline"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 bg-transparent"
              onClick={() => handleDelete(channel.id)}
              disabled={actionLoading === channel.id}
            >
              {actionLoading === channel.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Eliminar"}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <MessageCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">WhatsDirectory</h1>
                <p className="text-xs text-muted-foreground">Panel de Administración</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Pendientes ({pendingChannels.length})
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Aprobados ({approvedChannels.length})
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Rechazados ({rejectedChannels.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
              <p className="text-muted-foreground mt-2">Cargando canales...</p>
            </div>
          ) : (
            <>
              <TabsContent value="pending">
                {pendingChannels.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay canales pendientes</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingChannels.map((channel) => (
                      <ChannelCard key={channel.id} channel={channel} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="approved">
                {approvedChannels.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay canales aprobados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {approvedChannels.map((channel) => (
                      <ChannelCard key={channel.id} channel={channel} showActions={false} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected">
                {rejectedChannels.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No hay canales rechazados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rejectedChannels.map((channel) => (
                      <ChannelCard key={channel.id} channel={channel} showActions={false} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}
