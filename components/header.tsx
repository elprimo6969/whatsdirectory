"use client"

import { MessageCircle } from "lucide-react"
import { SubmitChannelForm } from "./submit-channel-form"
import { ThemeToggle } from "./theme-toggle"
import Link from "next/link"

export function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary transition-transform group-hover:scale-105">
              <MessageCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">WhatsDirectory</h1>
              <p className="text-xs text-muted-foreground">Directorio de Canales</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#directorio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Directorio
              </a>
              <a href="#creadores" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Creadores
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Acerca de
              </a>
            </nav>
            <ThemeToggle />
            <SubmitChannelForm />
          </div>
        </div>
      </div>
    </header>
  )
}
