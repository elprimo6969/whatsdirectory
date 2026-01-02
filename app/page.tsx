"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Filters } from "@/components/filters"
import { ChannelGrid } from "@/components/channel-grid"
import { FeaturedCreators } from "@/components/featured-creators"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"
import type { Channel } from "@/lib/data"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [sortBy, setSortBy] = useState<"date" | "rating">("date")

  useEffect(() => {
    async function fetchChannels() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("channels")
        .select("*")
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setChannels(data as Channel[])
      }
      setLoading(false)
    }
    fetchChannels()
  }, [])

  const filteredChannels = useMemo(() => {
    let filtered = [...channels]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (channel) =>
          channel.name.toLowerCase().includes(query) ||
          channel.description.toLowerCase().includes(query) ||
          channel.category.toLowerCase().includes(query),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((channel) => channel.category === selectedCategory)
    }

    if (selectedCountry !== "all") {
      filtered = filtered.filter((channel) => channel.country === selectedCountry)
    }

    if (sortBy === "date") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [channels, searchQuery, selectedCategory, selectedCountry, sortBy])

  const handleRandomChannel = useCallback(() => {
    if (channels.length === 0) return
    const randomIndex = Math.floor(Math.random() * channels.length)
    const randomChannel = channels[randomIndex]
    window.open(randomChannel.link, "_blank")
  }, [channels])

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category)
    if (category !== "all") {
      document.getElementById("directorio")?.scrollIntoView({ behavior: "smooth" })
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onRandomChannel={handleRandomChannel}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        <FeaturedCreators />

        <section id="directorio" className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <aside className="lg:w-56 flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Filtros</h2>
                  <Filters
                    selectedCountry={selectedCountry}
                    sortBy={sortBy}
                    onCountryChange={setSelectedCountry}
                    onSortChange={setSortBy}
                  />
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Canales Disponibles
                    <span className="text-muted-foreground font-normal ml-2">({filteredChannels.length})</span>
                  </h2>
                  {selectedCategory !== "all" && (
                    <button onClick={() => setSelectedCategory("all")} className="text-sm text-primary hover:underline">
                      Ver todos
                    </button>
                  )}
                </div>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground mt-4">Cargando canales...</p>
                  </div>
                ) : (
                  <ChannelGrid channels={filteredChannels} />
                )}
              </div>
            </div>
          </div>
        </section>

        <AboutSection />
      </main>
      <Footer />
    </div>
  )
}
