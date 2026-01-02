"use client"

import { useState } from "react"
import { type Channel, categories } from "@/lib/data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, ExternalLink, CheckCircle2, Eye, Users } from "lucide-react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"

interface ChannelCardProps {
  channel: Channel
  index?: number
}

function formatFollowers(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function ChannelCard({ channel, index = 0 }: ChannelCardProps) {
  const category = categories.find((c) => c.id === channel.category)
  const [userRating, setUserRating] = useState<number | null>(null)
  const [isRating, setIsRating] = useState(false)
  const [currentRating, setCurrentRating] = useState(channel.rating)
  const [totalVotes, setTotalVotes] = useState(channel.total_votes || 0)

  const handleRate = async (rating: number) => {
    if (isRating) return
    setIsRating(true)

    const supabase = createClient()
    const newTotalVotes = totalVotes + 1
    const newRating = Math.round(((currentRating * totalVotes + rating) / newTotalVotes) * 10) / 10

    const { error } = await supabase
      .from("channels")
      .update({ rating: newRating, total_votes: newTotalVotes })
      .eq("id", channel.id)

    if (!error) {
      setCurrentRating(newRating)
      setTotalVotes(newTotalVotes)
      setUserRating(rating)
    }
    setIsRating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden h-full flex flex-col">
        <div className="relative h-32 bg-secondary overflow-hidden">
          <img
            src={
              channel.thumbnail ||
              `/placeholder.svg?height=128&width=320&query=${encodeURIComponent(channel.name + " whatsapp channel")}`
            }
            alt={channel.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          <div className="absolute bottom-2 left-3 flex items-center gap-2">
            <span className="text-2xl">{category?.icon}</span>
            <Badge variant="secondary" className="text-xs bg-card/80 backdrop-blur-sm">
              {category?.name}
            </Badge>
          </div>
          <span className="absolute top-2 right-2 text-xl">{channel.country_flag}</span>
        </div>

        <CardContent className="p-4 flex-1">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {channel.name}
              </h3>
              {channel.verified && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-2 text-xs text-muted-foreground">
            {channel.creator_name && <span className="truncate">por {channel.creator_name}</span>}
            {channel.followers && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {formatFollowers(channel.followers)}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{channel.description}</p>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => !userRating && handleRate(i + 1)}
                disabled={!!userRating || isRating}
                className={`transition-transform ${!userRating && !isRating ? "hover:scale-125 cursor-pointer" : "cursor-default"}`}
              >
                <Star
                  className={`w-4 h-4 transition-colors ${
                    i < Math.round(currentRating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({currentRating.toFixed(1)}) · {totalVotes} votos
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Eye className="w-4 h-4 mr-1" />
                Vista previa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] bg-card border-border">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {channel.name}
                  {channel.verified && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Fake chat preview */}
                <div className="bg-secondary rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg">{category?.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{channel.name}</p>
                      <p className="text-xs text-muted-foreground">Canal de WhatsApp</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-card rounded-lg p-3 text-sm">
                      <p className="text-muted-foreground text-xs mb-1">Mensaje fijado</p>
                      <p>{channel.description}</p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3 text-sm">
                      <p className="text-xs text-muted-foreground">Hoy</p>
                      <p>¡Bienvenido al canal! 👋</p>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p>Esta es una vista previa simulada del canal.</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button asChild size="sm" className="flex-1 bg-primary hover:bg-primary/90">
            <a href={channel.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />
              Unirse
            </a>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
