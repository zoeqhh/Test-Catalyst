import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ReactNode, useCallback, useEffect, useId, useMemo, useState } from 'react';
import { BcImage } from '~/components/bc-image';

import { cn } from '~/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];

interface Image {
  altText: string;
  src: string;
}

interface Props {
  className?: string;
  images: Image[];
}

const CarouselImages = ({ className, images, ...props }: Props) => {
  const [carouselRef, api] = useEmblaCarousel({
    loop: true,
    axis: 'x',
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) {
      return;
    }

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
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
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
      aria-roledescription="carousel"
      className={cn('relative', className)}
      onKeyDownCapture={handleKeyDown}
      role="region"
      {...props}
    >
      <div className="flex items-center justify-between hidden">
        <div className="no-wrap flex">
          <button
            aria-label="Previous products"
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:text-gray-400',
              api?.scrollSnapList().length === 1 && 'hidden',
            )}
            disabled={!canScrollPrev}
            onClick={scrollPrev}
          >
            <ArrowLeft />
            <span className="sr-only">Previous slide</span>
          </button>

          <button
            aria-label="Next products"
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:text-gray-400',
              api?.scrollSnapList().length === 1 && 'hidden',
            )}
            disabled={!canScrollNext}
            onClick={scrollNext}
          >
            <ArrowRight />
            <span className="sr-only">Next slide</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden px-2" ref={carouselRef}>
        <div className="flex">
          { images && images.length ? images.map((image, index) => (
            <BcImage
              alt={image.altText}
              className="h-full w-full object-contain mr-[8px] max-w-[88%] border"
              height={800}
              priority={true}
              src={image.src}
              key={index}
              width={800}
            />
          )) : (
            <div className="w-full flex aspect-square items-center justify-center bg-gray-200">
              <div className="text-base font-semibold text-gray-500">Coming soon</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { CarouselImages };
