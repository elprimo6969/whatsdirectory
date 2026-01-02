import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Instagram, Heart } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Contacto administrativo</h2>
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <div className="w-24 h-24 rounded-full bg-primary/20 mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Uziel Becerra</h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                Creador de WhatsDirectory. Apasionado por conectar comunidades y hacer más fácil encontrar contenido de
                valor en WhatsApp.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Heart className="w-4 h-4 text-primary" />
                <span>Hecho con amor desde Apóstoles - Misiones, Argentina.</span>
              </div>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <a href="https://www.instagram.com/becerrauziel_/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                  @becerrauziel_
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
