import { Navbar } from "@/components/navbar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, HomeIcon, Phone, Mail, MapPinIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const featuredProperties = [
  {
    id: "1",
    title: "Casa Moderna en Zona Residencial Premium",
    price: "$450,000",
    location: "Polanco, Ciudad de México",
    bedrooms: 4,
    bathrooms: 3,
    area: "280 m²",
    image: "/placeholder.svg?height=250&width=400",
    type: "Casa",
  },
  {
    id: "2",
    title: "Departamento de Lujo con Vista Panorámica",
    price: "$320,000",
    location: "Santa Fe, Ciudad de México",
    bedrooms: 3,
    bathrooms: 2,
    area: "180 m²",
    image: "/placeholder.svg?height=250&width=400",
    type: "Departamento",
  },
  {
    id: "3",
    title: "Penthouse Exclusivo en Torre Corporativa",
    price: "$850,000",
    location: "Interlomas, Estado de México",
    bedrooms: 5,
    bathrooms: 4,
    area: "420 m²",
    image: "/placeholder.svg?height=250&width=400",
    type: "Penthouse",
  },
  {
    id: "4",
    title: "Casa Familiar con Jardín y Alberca",
    price: "$380,000",
    location: "Las Lomas, Guadalajara",
    bedrooms: 4,
    bathrooms: 3,
    area: "350 m²",
    image: "/placeholder.svg?height=250&width=400",
    type: "Casa",
  },
  {
    id: "5",
    title: "Loft Industrial en Zona Artística",
    price: "$220,000",
    location: "Roma Norte, Ciudad de México",
    bedrooms: 2,
    bathrooms: 2,
    area: "120 m²",
    image: "/placeholder.svg?height=250&width=400",
    type: "Loft",
  },
  {
    id: "6",
    title: "Villa de Lujo Frente al Mar",
    price: "$1,200,000",
    location: "Playa del Carmen, Quintana Roo",
    bedrooms: 6,
    bathrooms: 5,
    area: "500 m²",
    image: "/placeholder.svg?height=250&width=400",
    type: "Villa",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Casa moderna de lujo"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Encuentra tu hogar ideal</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Miles de propiedades esperándote. Busca, compara y encuentra la casa de tus sueños.
          </p>

          {/* Search Form */}
          <div className="bg-white rounded-lg p-6 shadow-2xl max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Ubicación</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input placeholder="Ciudad, colonia..." className="pl-10" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tipo de propiedad</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Rango de precio</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Precio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-200k">$0 - $200,000</SelectItem>
                    <SelectItem value="200k-500k">$200,000 - $500,000</SelectItem>
                    <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                    <SelectItem value="1m+">$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-primary/90 h-10">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Propiedades Destacadas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestra selección de las mejores propiedades disponibles en las zonas más exclusivas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white bg-transparent"
            >
              Ver todas las propiedades
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-primary-100">Propiedades</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8,500+</div>
              <div className="text-primary-100">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-primary-100">Ciudades</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-primary-100">Años de Experiencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para encontrar tu próximo hogar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Regístrate gratis y accede a herramientas exclusivas: guarda tus favoritos, recibe alertas personalizadas
              y conecta directamente con agentes especializados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-secondary hover:bg-gray-100">
                  Registrarse Gratis
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-secondary bg-transparent"
              >
                Publicar Propiedad
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <HomeIcon className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">InmoPortal</span>
              </div>
              <p className="text-gray-400 mb-4">
                Tu portal de confianza para encontrar la propiedad perfecta. Conectamos sueños con realidades.
              </p>
              <div className="flex space-x-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                >
                  Facebook
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                >
                  Instagram
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Propiedades</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Casas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Departamentos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Terrenos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Oficinas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Carreras
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +52 55 1234 5678
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  info@inmoportal.com
                </li>
                <li className="flex items-center">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  Ciudad de México, México
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InmoPortal. Todos los derechos reservados.</p>
            <div className="flex justify-center space-x-6 mt-4">
              <Link href="#" className="hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
