import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useId, useMemo, useState } from 'react';

import { cn } from '~/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];

interface Props {
  className?: string;
  pageSize?: 2 | 3 | 4;
  products: ReactNode[];
  title: string;
}

const CarouselProducts = ({ className, title, pageSize = 4, products, ...props }: Props) => {
  const id = useId();
  const titleId = useId();

  const [carouselRef, api] = useEmblaCarousel({
    loop: false,
    axis: 'x',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [selectedSnapIndex, setSelectedSnapIndex] = useState(0);

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) {
      return;
    }

    setSelectedSnapIndex(emblaApi.selectedScrollSnap());

    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ChevronLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ChevronRight') {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on('reInit', onSelect);
    api.on('select', onSelect);

    return () => {
      api.off('select', onSelect);
    };
  }, [api, onSelect]);

  return (
    <div
      aria-labelledby={titleId}
      aria-roledescription="carousel"
      className={cn('relative', className)}
      onKeyDownCapture={handleKeyDown}
      role="region"
      {...props}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black uppercase my-5 lg:text-4xl" id={titleId}>
          {title}
        </h2>
        <span className="no-wrap flex hidden lg:block">
          <button
            aria-label="Previous products"
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:text-gray-500 border-black disabled:hover:border-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-500 border-0 p-2.5 bg-transparent hover:bg-transparent hover:text-primary',
              api?.scrollSnapList().length === 1 && 'hidden',
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            <ChevronLeft />
            <span className="sr-only">Previous slide</span>
          </button>

          <button
            aria-label="Next products"
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:text-gray-500 border-black disabled:hover:border-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-500 border-0 p-2.5 bg-transparent hover:bg-transparent hover:text-primary',
              api?.scrollSnapList().length === 1 && 'hidden',
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            <ChevronRight />
            <span className="sr-only">Next slide</span>
          </button>
        </span>
      </div>

      <div className="overflow-hidden -mx-4 md:-mx-10" ref={carouselRef}>
        <div className="flex px-4 md:px-10 lg:-mr-4">
          {products.map((product) => (product))}
        </div>
      </div>

      <div
        aria-label="Slides"
        className={cn(
          'no-wrap absolute bottom-1 flex w-full items-center justify-center gap-2 hidden',
          api?.scrollSnapList().length === 1 && 'hidden',
        )}
        role="tablist"
      >
        {products.map((_, index) => (
          <button
            aria-controls={`${id}-slide-${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={selectedSnapIndex === index}
            className={cn(
              "h-7 w-7 p-0.5 after:block after:h-0.5 after:w-full after:bg-gray-400 after:content-[''] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20",
              selectedSnapIndex === index && 'after:bg-black',
            )}
            key={index}
            onClick={() => api?.scrollTo(index)}
            role="tab"
          />
        ))}
      </div>
    </div>
  );
};

export { CarouselProducts };
