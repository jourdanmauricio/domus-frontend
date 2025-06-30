"use client"

import { Button } from "@/components/ui/button"
import { Home, Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">InmoPortal</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 ml-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Propiedades
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Servicios
          </Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Contacto
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Registrarse
              </Button>
            </Link>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden bg-transparent">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/" className="text-sm font-medium">
                  Inicio
                </Link>
                <Link href="#" className="text-sm font-medium">
                  Propiedades
                </Link>
                <Link href="#" className="text-sm font-medium">
                  Servicios
                </Link>
                <Link href="#" className="text-sm font-medium">
                  Contacto
                </Link>
                <div className="pt-4 space-y-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full bg-transparent">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-primary hover:bg-primary/90">Registrarse</Button>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
