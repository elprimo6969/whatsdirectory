"use client"

import { useState, useMemo } from "react"
import { Search, Shuffle, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"

interface HeroProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  onRandomChannel: () => void
  onCategorySelect: (category: string) => void
  selectedCategory: string
}

export function Hero({ searchQuery, onSearchChange, onRandomChannel, onCategorySelect, selectedCategory }: HeroProps) {
  const [isFocused, setIsFocused] = useState(false)

  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return []
    const query = searchQuery.toLowerCase()
    return categories
      .filter((c) => c.id !== "all" && (c.name.toLowerCase().includes(query) || c.id.includes(query)))
      .slice(0, 5)
  }, [searchQuery])

  return (
    <section className="py-12 md:py-20 text-center">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance"
        >
          Encuentra tu <span className="text-primary">Canal</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty"
        >
          Descubre los mejores canales de WhatsApp. Explora por categorías, países y únete a comunidades increíbles.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative max-w-lg mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar canales por nombre o descripción..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-12 pr-10 h-14 bg-card border-border text-foreground placeholder:text-muted-foreground text-base rounded-xl shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          <AnimatePresence>
            {isFocused && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
              >
                {suggestions.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onCategorySelect(cat.id)
                      onSearchChange("")
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary transition-colors text-left"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-foreground">{cat.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <Button
            onClick={onRandomChannel}
            variant="outline"
            size="lg"
            className="gap-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all bg-transparent"
          >
            <Shuffle className="w-5 h-5" />
            Me siento con suerte
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Explorar por categoría</h3>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategorySelect(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
