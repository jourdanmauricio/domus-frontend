import { ImageFile } from '@/components/form-generics/image-uploader';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

type ImagesContainerProps = {
  images: ImageFile[];
  removeImage: (id: string) => void;
};

const ImagesContainer = ({ images, removeImage }: ImagesContainerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const prevImagesLengthRef = useRef(images.length);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 1, spacing: 0 },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  // Recargar el slider cuando cambien las imágenes
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update();
    }
  }, [images, instanceRef]);

  // Resetear el slide actual cuando se eliminen imágenes
  useEffect(() => {
    if (images.length < prevImagesLengthRef.current) {
      // Si se eliminó una imagen, ajustar el slide actual
      setCurrentSlide((prev) => {
        const newSlide = Math.min(prev, images.length - 1);
        return Math.max(0, newSlide);
      });
    }
    prevImagesLengthRef.current = images.length;
  }, [images.length]);

  // Ir al primer slide cuando se agreguen nuevas imágenes
  useEffect(() => {
    if (images.length > prevImagesLengthRef.current && images.length === 1) {
      setCurrentSlide(0);
    }
  }, [images.length]);

  return (
    <div className='flex w-full flex-col items-center'>
      <h3 className='mb-2 text-lg font-bold'>Imágenes</h3>
      {images.length > 0 && (
        <div className='relative flex w-full max-w-xs flex-col items-center sm:max-w-sm md:max-w-md'>
          {/* Botones de navegación */}
          {images.length > 1 && (
            <>
              <button
                type='button'
                onClick={() => instanceRef.current?.prev()}
                disabled={currentSlide === 0}
                className='absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white disabled:opacity-50'
                aria-label='Imagen anterior'
              >
                <ChevronLeft className='h-5 w-5' />
              </button>
              <button
                type='button'
                onClick={() => instanceRef.current?.next()}
                disabled={currentSlide === images.length - 1}
                className='absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md transition-all hover:bg-white disabled:opacity-50'
                aria-label='Imagen siguiente'
              >
                <ChevronRight className='h-5 w-5' />
              </button>
            </>
          )}
          <div ref={sliderRef} className='keen-slider w-full'>
            {images.map((image) => (
              <div key={image.id} className='keen-slider__slide flex w-full flex-col items-center'>
                <div className='relative flex h-56 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50'>
                  <img
                    src={image.previewUrl}
                    alt={`Imagen ${image.id}`}
                    className='h-full w-full object-contain'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(image.id)}
                    className='absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-80 transition-colors hover:bg-red-600'
                    aria-label='Eliminar imagen'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>
                <p className='mt-1 truncate text-xs text-gray-500'>{image.file.name}</p>
              </div>
            ))}
          </div>
          {/* Mensaje de posición */}
          <div className='mt-2 text-sm text-gray-600'>
            Imagen {currentSlide + 1} de {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export { ImagesContainer };
