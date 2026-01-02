"use client"

import { countries } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown } from "lucide-react"

interface FiltersProps {
  selectedCountry: string
  sortBy: "date" | "rating"
  onCountryChange: (country: string) => void
  onSortChange: (sort: "date" | "rating") => void
}

export function Filters({ selectedCountry, sortBy, onCountryChange, onSortChange }: FiltersProps) {
  return (
    <div className="space-y-6">
      {/* Country Filter with flags */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">País</h3>
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-full bg-card border-border">
            <SelectValue placeholder="Selecciona un país" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.id} value={country.id}>
                <span className="mr-2 text-lg">{country.flag}</span>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Ordenar por</h3>
        <div className="flex flex-col gap-2">
          <Button
            variant={sortBy === "date" ? "default" : "secondary"}
            size="sm"
            onClick={() => onSortChange("date")}
            className="justify-start"
          >
            <ArrowUpDown className="w-3 h-3 mr-2" />
            Más nuevos
          </Button>
          <Button
            variant={sortBy === "rating" ? "default" : "secondary"}
            size="sm"
            onClick={() => onSortChange("rating")}
            className="justify-start"
          >
            <ArrowUpDown className="w-3 h-3 mr-2" />
            Mejor rating
          </Button>
        </div>
      </div>
    </div>
  )
}
