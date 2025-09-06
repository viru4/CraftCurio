import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Carousel({ className = '', opts, orientation = 'horizontal', setApi, children, ...props }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ axis: orientation === 'horizontal' ? 'x' : 'y', ...opts })

  useEffect(() => {
    if (setApi) setApi(emblaApi)
  }, [emblaApi, setApi])

  return (
    <div ref={emblaRef} className={cn('overflow-hidden', className)} {...props}>
      <div className={cn('flex', orientation === 'horizontal' ? 'flex-row' : 'flex-col')}>{children}</div>
    </div>
  )
}

export function CarouselItem({ className = '', ...props }) {
  return <div className={cn('min-w-0 shrink-0 grow-0 basis-full', className)} {...props} />
}

export function CarouselPrevious({ className = '', onClick, disabled, ...props }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('absolute left-3 top-1/2 -translate-y-1/2 z-10', className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}

export function CarouselNext({ className = '', onClick, disabled, ...props }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn('absolute right-3 top-1/2 -translate-y-1/2 z-10', className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <ChevronRight className="h-5 w-5" />
    </Button>
  )
}

export function useCarouselControls(api) {
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback((embla) => {
    setCanScrollPrev(embla.canScrollPrev())
    setCanScrollNext(embla.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on('reInit', onSelect)
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
      api.off('reInit', onSelect)
    }
  }, [api, onSelect])

  const scrollPrev = useCallback(() => api && api.scrollPrev(), [api])
  const scrollNext = useCallback(() => api && api.scrollNext(), [api])

  return { scrollPrev, scrollNext, canScrollPrev, canScrollNext }
}


