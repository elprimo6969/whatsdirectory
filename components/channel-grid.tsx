import type { Channel } from "@/lib/data"
import { ChannelCard } from "./channel-card"

interface ChannelGridProps {
  channels: Channel[]
}

export function ChannelGrid({ channels }: ChannelGridProps) {
  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No se encontraron canales</p>
        <p className="text-muted-foreground/70 text-sm mt-1">Intenta con otros filtros o busca algo diferente</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {channels.map((channel, index) => (
        <ChannelCard key={channel.id} channel={channel} index={index} />
      ))}
    </div>
  )
}
