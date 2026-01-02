export interface Channel {
  id: string
  name: string
  category: string
  link: string
  description: string
  rating: number
  total_votes: number
  country: string
  country_flag: string
  verified: boolean
  status: "pending" | "approved" | "rejected"
  submitted_by_email?: string
  created_at: string
  updated_at: string
  creator_name?: string
  followers?: number
  thumbnail?: string
  screenshots?: string[]
}

export const categories = [
  { id: "all", name: "Todos", icon: "📋" },
  { id: "entretenimiento", name: "Entretenimiento", icon: "🎬" },
  { id: "memes", name: "Memes", icon: "😂" },
  { id: "ofertas", name: "Ofertas", icon: "🏷️" },
  { id: "noticias", name: "Noticias", icon: "📰" },
  { id: "programacion", name: "Programación", icon: "💻" },
  { id: "deportes", name: "Deportes", icon: "⚽" },
  { id: "gaming", name: "Gaming", icon: "🎮" },
  { id: "cripto", name: "Cripto", icon: "₿" },
  { id: "salud", name: "Salud & Fitness", icon: "💪" },
  { id: "educacion", name: "Educación", icon: "📚" },
  { id: "tecnologia", name: "Tecnología", icon: "🔧" },
  { id: "viajes", name: "Viajes", icon: "✈️" },
  { id: "musica", name: "Música", icon: "🎵" },
  { id: "arte", name: "Arte", icon: "🎨" },
  { id: "negocios", name: "Negocios", icon: "💼" },
  { id: "cristiano", name: "Cristiano", icon: "✝️" },
  { id: "otros", name: "Otros", icon: "📁" },
]

export const countries = [
  { id: "all", name: "Global", flag: "🌎" },
  { id: "mx", name: "México", flag: "🇲🇽" },
  { id: "es", name: "España", flag: "🇪🇸" },
  { id: "ar", name: "Argentina", flag: "🇦🇷" },
  { id: "co", name: "Colombia", flag: "🇨🇴" },
  { id: "pe", name: "Perú", flag: "🇵🇪" },
  { id: "cl", name: "Chile", flag: "🇨🇱" },
  { id: "ve", name: "Venezuela", flag: "🇻🇪" },
  { id: "ec", name: "Ecuador", flag: "🇪🇨" },
  { id: "us", name: "Estados Unidos", flag: "🇺🇸" },
  { id: "br", name: "Brasil", flag: "🇧🇷" },
]

export interface Creator {
  id: string
  name: string
  avatar: string
  channels: number
  followers: number
}

export const featuredCreators: Creator[] = [
  { id: "1", name: "TechMaster", avatar: "/tech-creator-avatar.png", channels: 5, followers: 250000 },
  { id: "2", name: "MemeLord", avatar: "/meme-creator-avatar.jpg", channels: 8, followers: 500000 },
  { id: "3", name: "NewsDaily", avatar: "/news-creator-avatar.jpg", channels: 3, followers: 180000 },
  { id: "4", name: "GamerPro", avatar: "/gamer-creator-avatar.jpg", channels: 6, followers: 320000 },
  { id: "5", name: "FitCoach", avatar: "/fitness-creator-avatar.jpg", channels: 4, followers: 150000 },
]
