"use client"
import { Key, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { BcImage } from '~/components/bc-image';
import { Link } from '~/components/link';
import { cn } from '~/lib/utils';

import { Compare } from './compare';
// import { Clothes, Heart, Left, ShowAll } from './svg';
import { Minus, Plus, HeartIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface Image {
  altText: string;
  src: string;
}

type Price =
  | string
  | {
      type: 'sale';
      currentValue: string;
      previousValue: string;
    }
  | {
      type: 'range';
      minValue: string;
      maxValue: string;
    };

interface Product {
  id: string;
  name: string;
  href: string;
  image?: Image;
  price?: Price;
  subtitle?: string;
  badge?: string;
  customFields?: any;
  images?: any;
  options?: any;
}

interface Props extends Product {
  addToCart?: ReactNode;
  className?: string;
  imagePriority?: boolean;
  imageSize?: 'square' | 'tall' | 'wide';
  showCompare?: boolean;
  needImagesSlider?: boolean;
}

function filterImagesByColor(images: any) {
  const seenColors = new Set();
  return images.reduce((acc: any, image: any) => {
      const colorMatch = image.altText.match(/\((.*?)\)/);
      const color = colorMatch ? colorMatch[1].trim() : null;

      if (color && !seenColors.has(color)) {
          seenColors.add(color);
          acc.push(image);
      }

      return acc;
  }, []);
}

const ProductCard = ({
  addToCart,
  className,
  image,
  imagePriority = false,
  imageSize,
  href,
  price,
  id,
  showCompare = true,
  subtitle,
  name,
  images,
  customFields,
  needImagesSlider = false,
  ...props
}: Props) => {
  const _images = useMemo(() => removeEdgesAndNodes(images), [images]);
  // _images.filter((image, index, arr) => {
  //     const color = image
  // })

  const filteredImages = useMemo(() => filterImagesByColor(_images), [_images]);

  const [showAll, setShowAll] = useState(false);
  const [url, setUrl] = useState(() => {
    return filteredImages[0]?.url || '';
  });
  const [displayedColors, setDisplayedColors] = useState<[any]>()

  const [width, setWidth] = useState(0);

  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(true);

  const [favorite, setFavorite] = useState<boolean>(false)
  const observedRef = useRef(null);


  useEffect(() => {
    setDisplayedColors(filteredImages.slice(0, 5))
  }, [filteredImages]);

  useEffect(() => {
    setShowAll(false)
    if (width > 300) {
      setDisplayedColors(filteredImages.slice(0, 5))
    } else if(width > 251) {
      setDisplayedColors(filteredImages.slice(0, 4))
    } else if(width > 211) {
      setDisplayedColors(filteredImages.slice(0, 3))
    }
  }, [width])
  useEffect(() => {

     const storedFavorites = JSON.parse(localStorage.getItem('favorites') as string) || [];
        
     if (storedFavorites.includes(id)) {
         setFavorite(true);
     } else {
         setFavorite(false);
     }
    const handleResize = (entries: any) => {
      for (let entry of entries) {
        setWidth(entry.contentRect.width);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (observedRef.current) {
      resizeObserver.observe(observedRef.current);
    }

    return () => {
      if (observedRef.current) {
        resizeObserver.unobserve(observedRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const index = filteredImages.findIndex((item: any) => item.url === url);
    setHasPrev(index > 0); 
    
    setHasNext(index < filteredImages.length - 1);
  }, [url, filteredImages]); 


  const handleClickPre = () => {
    if (!filteredImages || filteredImages.length === 0) return;

    const index = filteredImages.findIndex((item: any) => item.url === url);
    
    if (index > 0) { 
        const previousVariant = filteredImages[index - 1];
        setUrl(previousVariant.url);
        setHasPrev(true);
    } else {
        setHasPrev(false)
    }
  };

  const handleClickNext = () => {
    if (!filteredImages || !displayedColors) return;

    const index = filteredImages.findIndex((item: any) => item.url === url);
    const nextIndex = index + 1;

      if (nextIndex < filteredImages.length && displayedColors[nextIndex]) {
          const nextVariant = filteredImages[nextIndex];
          if (nextVariant) {
              setUrl(nextVariant.url);
              setHasNext(true);
          }
      } else {
          setHasNext(false)
      }
  };

  const handleVariantClick = (url: string) => {
    setUrl(url)
  };

  const handleClickHeart = useCallback(() => {
    let favorites = JSON.parse(localStorage.getItem('favorites') as string) || [];
    if (!favorite) {
        if (!favorites.includes(id)) {
            favorites.push(id); 
            localStorage.setItem('favorites', JSON.stringify(favorites)); 
            
        }
    } else {
        favorites = favorites.filter((favId: string) => favId !== id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
    setFavorite(!favorite);
  },[favorite, id])

  const _customFields = removeEdgesAndNodes(customFields);

  return  <div className={cn('relative flex flex-col overflow-visible mb-[80px]', className)} {...props}>
  <div className="relative flex justify-center pb-[16px] product-card-image-container">
    <div
      className={cn('relative flex-auto', {
        'aspect-square': imageSize === 'square',
        'aspect-[3/5]': imageSize === 'tall',
        'aspect-[4/5]': imageSize === 'wide',
      })}
    >
      {url ? (
        <a href={href}><BcImage
          alt="product"
          className="object-contain"
          fill
          priority={imagePriority}
          sizes="(max-width: 768px) 50vw, (max-width: 1536px) 25vw, 500px"
          src={url}
        /></a>
      ) : (
        <a href={href}><div className="h-full w-full bg-gray-300" /></a>
      )}
    </div>
    {
       needImagesSlider && <div className="absolute flex gap-[12px] bottom-[28px] left-[12px] right-0 button-contaier opacity-0">
      <div className={`flex items-center w-[52px] h-[52px] bg-white justify-center shadow-productCard rounded-[4px] ${hasPrev ? 'cursor-pointer' : 'cursor-not-allowed'} hover:text-primary`} onClick={handleClickPre}>
        <ChevronLeftIcon />
      </div>
      <div className="flex items-center w-[52px] cursor-pointer h-[52px] bg-white justify-center shadow-productCard rounded-[4px] hover:text-primary">
        <HeartIcon onClick={handleClickHeart} fill={favorite ? 'red': '#fff'} className={favorite ? 'text-red-600' : ''}/>
      </div>
      <div className="flex items-center w-[52px] cursor-pointer h-[52px] bg-white justify-center shadow-productCard rounded-[4px] hover:text-primary">
        <Compare id={id} image={image} name={name} />
      </div>
      <div className={`flex items-center w-[52px] h-[52px] bg-white justify-center shadow-productCard rounded-[4px] ${hasNext ? 'cursor-pointer' : 'cursor-not-allowed'} hover:text-primary`} onClick={handleClickNext}>
        <ChevronRightIcon />
      </div>
    </div>}
  </div>
  <div  className='hidden md:flex items-center gap-[8px] flex-wrap mb-[16px]' ref={observedRef}>
      {
        needImagesSlider && displayedColors && displayedColors.map((item: any, index:number) => {
          const isActive = url === item.url;

          return (
            <div key={index} onClick={() => handleVariantClick(item.url)} className={`cursor-pointer border w-[40px] h-[40px]  ${isActive ? 'border border-black rounded-[6px] overflow-hidden' : 'border-white'}`}>
              <BcImage
                alt={item.altText}
                className="h-full w-full object-contain object-center"
                height={40}
                src={item.url}
                width={40}
              />
            </div>
          )
        })
      }
       {
         needImagesSlider && <button
        className="w-[40px] h-[40px] flex items-center justify-center border border-BF rounded-[6px] text-[22px]"
        onClick={() => {
          setShowAll((prev) => {
            const newShowAll = !prev;
            if (newShowAll) {
              setDisplayedColors(filteredImages);
            } else {
              if (width > 300) {
                setDisplayedColors(filteredImages.slice(0, 5))
              } else if(width > 251) {
                setDisplayedColors(filteredImages.slice(0, 4))
              } else if(width > 211) {
                setDisplayedColors(filteredImages.slice(0, 3))
              }
            }
            return newShowAll;
          });
        }}
      >

        {showAll ? <Minus className='w-[16px]'/> : <Plus className='w-[16px]'/>
 }
      </button>}
  </div>
  <div className={cn('flex flex-1 flex-col gap-1', Boolean(addToCart) && 'justify-end')}>
    {subtitle ? <p className="text-base text-gray-600">{subtitle}</p> : null}
    <h3 className="text-xl font-bold">
      <Link
        className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary/20 focus-visible:ring-0"
        href={href}
      >
        {name}
      </Link>
    </h3>
        {Boolean(_customFields) &&
          _customFields.map((customField: any) => {
            if (customField.name === 'attribute_1') return (
              <div className='font-normal text-gray-700' key={customField.entityId}>
                <p>{customField.value.replace(/m�/, '㎡')}</p>
              </div>
            )
          })
        }
    {/* <div className="flex flex-wrap items-end justify-between pt-1">
      {Boolean(price) &&
        (typeof price === 'object' ? (
          <p className="flex flex-col gap-1">
            {price.type === 'range' && (
              <span>
                {price.minValue} - {price.maxValue}
              </span>
            )}

            {price.type === 'sale' && (
              <>
                <span>
                  Was: <span className="line-through">{price.previousValue}</span>
                </span>
                <span>Now: {price.currentValue}</span>
              </>
            )}
          </p>
        ) : (
          <span>{price}</span>
        ))}

      {showCompare && <Compare id={id} image={image} name={name} />}
    </div> */}
  </div>
  {/* {addToCart} */}
</div>
};

ProductCard.displayName = 'ProductCard';

export { ProductCard, type Price };
