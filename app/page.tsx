import { Navbar } from '@/components/navbar';
import { PropertyCard } from '@/components/property-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, MapPin, HomeIcon, Phone, Mail, MapPinIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const featuredProperties = [
  {
    id: '1',
    title: 'Casa Moderna en Zona Residencial Premium',
    price: '$450,000',
    location: 'Polanco, Ciudad de México',
    bedrooms: 4,
    bathrooms: 3,
    area: '280 m²',
    image: '/placeholder.svg?height=250&width=400',
    type: 'Casa',
  },
  {
    id: '2',
    title: 'Departamento de Lujo con Vista Panorámica',
    price: '$320,000',
    location: 'Santa Fe, Ciudad de México',
    bedrooms: 3,
    bathrooms: 2,
    area: '180 m²',
    image: '/placeholder.svg?height=250&width=400',
    type: 'Departamento',
  },
  {
    id: '3',
    title: 'Penthouse Exclusivo en Torre Corporativa',
    price: '$850,000',
    location: 'Interlomas, Estado de México',
    bedrooms: 5,
    bathrooms: 4,
    area: '420 m²',
    image: '/placeholder.svg?height=250&width=400',
    type: 'Penthouse',
  },
  {
    id: '4',
    title: 'Casa Familiar con Jardín y Alberca',
    price: '$380,000',
    location: 'Las Lomas, Guadalajara',
    bedrooms: 4,
    bathrooms: 3,
    area: '350 m²',
    image: '/placeholder.svg?height=250&width=400',
    type: 'Casa',
  },
  {
    id: '5',
    title: 'Loft Industrial en Zona Artística',
    price: '$220,000',
    location: 'Roma Norte, Ciudad de México',
    bedrooms: 2,
    bathrooms: 2,
    area: '120 m²',
    image: '/placeholder.svg?height=250&width=400',
    type: 'Loft',
  },
  {
    id: '6',
    title: 'Villa de Lujo Frente al Mar',
    price: '$1,200,000',
    location: 'Playa del Carmen, Quintana Roo',
    bedrooms: 6,
    bathrooms: 5,
    area: '500 m²',
    image: '/placeholder.svg?height=250&width=400',
    type: 'Villa',
  },
];

export default function HomePage() {
  return (
    <div className='h-full bg-white'>
      <Navbar />

      {/* Hero Section */}
      <section className='relative flex h-[600px] items-center justify-center'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/placeholder.svg?height=600&width=1200'
            alt='Casa moderna de lujo'
            fill
            className='object-cover'
            priority
          />
          <div className='absolute inset-0 bg-black/40' />
        </div>

        <div className='relative z-10 mx-auto max-w-4xl px-4 text-center text-white'>
          <h1 className='mb-6 text-4xl font-bold md:text-6xl'>Encuentra tu hogar ideal</h1>
          <p className='mb-8 text-xl opacity-90 md:text-2xl'>
            Miles de propiedades esperándote. Busca, compara y encuentra la casa de tus sueños.
          </p>

          {/* Search Form */}
          <div className='mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-2xl'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Ubicación</label>
                <div className='relative'>
                  <MapPin className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input placeholder='Ciudad, colonia...' className='pl-10' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Tipo de propiedad</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccionar' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='casa'>Casa</SelectItem>
                    <SelectItem value='departamento'>Departamento</SelectItem>
                    <SelectItem value='terreno'>Terreno</SelectItem>
                    <SelectItem value='oficina'>Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Rango de precio</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder='Precio' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='0-200k'>$0 - $200,000</SelectItem>
                    <SelectItem value='200k-500k'>$200,000 - $500,000</SelectItem>
                    <SelectItem value='500k-1m'>$500,000 - $1,000,000</SelectItem>
                    <SelectItem value='1m+'>$1,000,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-end'>
                <Button className='h-10 w-full bg-primary hover:bg-primary/90'>
                  <Search className='mr-2 h-4 w-4' />
                  Buscar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className='bg-muted/30 py-16'>
        <div className='container mx-auto px-4'>
          <div className='mb-12 text-center'>
            <h2 className='mb-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              Propiedades Destacadas
            </h2>
            <p className='mx-auto max-w-2xl text-lg text-gray-600'>
              Descubre nuestra selección de las mejores propiedades disponibles en las zonas más
              exclusivas
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>

          <div className='mt-12 text-center'>
            <Button
              size='lg'
              variant='outline'
              className='border-primary bg-transparent text-primary hover:bg-primary hover:text-white'
            >
              Ver todas las propiedades
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='bg-primary py-16 text-white'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 gap-8 text-center md:grid-cols-4'>
            <div>
              <div className='mb-2 text-4xl font-bold'>15,000+</div>
              <div className='text-primary-100'>Propiedades</div>
            </div>
            <div>
              <div className='mb-2 text-4xl font-bold'>8,500+</div>
              <div className='text-primary-100'>Clientes Satisfechos</div>
            </div>
            <div>
              <div className='mb-2 text-4xl font-bold'>25+</div>
              <div className='text-primary-100'>Ciudades</div>
            </div>
            <div>
              <div className='mb-2 text-4xl font-bold'>10+</div>
              <div className='text-primary-100'>Años de Experiencia</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='bg-secondary py-16'>
        <div className='container mx-auto px-4 text-center'>
          <div className='mx-auto max-w-3xl text-white'>
            <h2 className='mb-6 text-3xl font-bold md:text-4xl'>
              ¿Listo para encontrar tu próximo hogar?
            </h2>
            <p className='mb-8 text-xl opacity-90'>
              Regístrate gratis y accede a herramientas exclusivas: guarda tus favoritos, recibe
              alertas personalizadas y conecta directamente con agentes especializados.
            </p>
            <div className='flex flex-col justify-center gap-4 sm:flex-row'>
              <Link href='/register'>
                <Button size='lg' className='bg-white text-secondary hover:bg-gray-100'>
                  Registrarse Gratis
                </Button>
              </Link>
              <Button
                size='lg'
                variant='outline'
                className='border-white bg-transparent text-white hover:bg-white hover:text-secondary'
              >
                Publicar Propiedad
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 py-12 text-white'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
            <div>
              <div className='mb-4 flex items-center space-x-2'>
                <HomeIcon className='h-6 w-6 text-primary' />
                <span className='text-xl font-bold'>InmoPortal</span>
              </div>
              <p className='mb-4 text-gray-400'>
                Tu portal de confianza para encontrar la propiedad perfecta. Conectamos sueños con
                realidades.
              </p>
              <div className='flex space-x-4'>
                <Button
                  size='sm'
                  variant='outline'
                  className='border-gray-600 bg-transparent text-gray-400 hover:text-white'
                >
                  Facebook
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='border-gray-600 bg-transparent text-gray-400 hover:text-white'
                >
                  Instagram
                </Button>
              </div>
            </div>

            <div>
              <h3 className='mb-4 font-semibold'>Propiedades</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Casas
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Departamentos
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Terrenos
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Oficinas
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-4 font-semibold'>Empresa</h3>
              <ul className='space-y-2 text-gray-400'>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href='#' className='transition-colors hover:text-white'>
                    Carreras
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className='mb-4 font-semibold'>Contacto</h3>
              <ul className='space-y-2 text-gray-400'>
                <li className='flex items-center'>
                  <Phone className='mr-2 h-4 w-4' />
                  +52 55 1234 5678
                </li>
                <li className='flex items-center'>
                  <Mail className='mr-2 h-4 w-4' />
                  info@inmoportal.com
                </li>
                <li className='flex items-center'>
                  <MapPinIcon className='mr-2 h-4 w-4' />
                  Ciudad de México, México
                </li>
              </ul>
            </div>
          </div>

          <div className='mt-8 border-t border-gray-800 pt-8 text-center text-gray-400'>
            <p>&copy; 2024 InmoPortal. Todos los derechos reservados.</p>
            <div className='mt-4 flex justify-center space-x-6'>
              <Link href='#' className='transition-colors hover:text-white'>
                Términos y Condiciones
              </Link>
              <Link href='#' className='transition-colors hover:text-white'>
                Política de Privacidad
              </Link>
              <Link href='#' className='transition-colors hover:text-white'>
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
