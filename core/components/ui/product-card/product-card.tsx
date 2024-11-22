"use client"
import { ReactNode, useEffect, useRef, useState } from 'react';

import { BcImage } from '~/components/bc-image';
import { Link } from '~/components/link';
import { cn } from '~/lib/utils';

import { Compare } from './compare';
import { Clothes, Heart, Left, ShowAll } from './svg';
import { Minus, Plus, Shirt } from 'lucide-react';

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
}

interface Props extends Product {
  addToCart?: ReactNode;
  className?: string;
  imagePriority?: boolean;
  imageSize?: 'square' | 'tall' | 'wide';
  showCompare?: boolean;
  variants?: any;
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
  variants,
  ...props
}: Props) => {
  const [showAll, setShowAll] = useState(false);
  const [url, setUrl] = useState(variants.edges ? variants.edges[0].node.defaultImage.url.replace('40w', '400w') : '')
  const [displayedVariants, setDisplayedVariants] = useState(variants.edges)
  
  const [width, setWidth] = useState(0);
  const observedRef = useRef(null); 

  useEffect(() => {
    setShowAll(false)
    if (width > 300) {
      setDisplayedVariants(variants.edges.slice(0, 5))
    } else if(width > 251) {
      setDisplayedVariants(variants.edges.slice(0, 4))
    } else if(width > 211) {
      setDisplayedVariants(variants.edges.slice(0, 3))
    }
  }, [width])
  useEffect(() => {
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


  const handleClickPre = () => {
    const index = variants.edges.findIndex((item: any) => item.node.defaultImage.url.replace('40w', '400w') === url);
    const previousIndex = index - 1;
    const previousVariant = variants.edges[previousIndex];
    if (previousVariant) {
      setUrl(previousVariant.node.defaultImage.url.replace('40w', '400w'))
    }
  };

  const handleClickNext = () => {
    const index = variants.edges.findIndex((item: any) => item.node.defaultImage.url.replace('40w', '400w') === url);
    const nextIndex = index + 1;
    const nextVariant = variants.edges[nextIndex];
    if (nextVariant && nextIndex < displayedVariants.length) {
      setUrl(nextVariant.node.defaultImage.url.replace('40w', '400w'))
    }
  };

  const handleVariantClick = (url: string) => {
    setUrl(url.replace('40w', '400w'))
  };

  return  <div className={cn('group relative flex flex-col overflow-visible mb-[80px]', className)} {...props}>
  <div className="relative flex justify-center pb-[16px] product-card-image-container">
    <div
      className={cn('relative flex-auto', {
        'aspect-square': imageSize === 'square',
        'aspect-[3/5]': imageSize === 'tall',
        'aspect-[364/455]': imageSize === 'wide',
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
        <a href={href}><div className="h-full w-full bg-gray-200" /></a>
      )}
    </div>
    <div className="absolute flex gap-[12px] bottom-[28px] left-[12px] right-0 button-contaier opacity-0">
      <div className="flex items-center w-[52px] cursor-pointer h-[52px] bg-white justify-center shadow-productCard rounded-[4px]" onClick={handleClickPre}><Left /></div>
      <div className="flex items-center w-[52px] cursor-pointer h-[52px] bg-white justify-center shadow-productCard rounded-[4px]"><Heart /></div>
      <div className="flex items-center w-[52px] cursor-pointer h-[52px] bg-white justify-center shadow-productCard rounded-[4px]"><Shirt className="w-[18px] h-[16px]"/></div>
      <div className="flex items-center w-[52px] cursor-pointer h-[52px] bg-white justify-center shadow-productCard rounded-[4px] rotate-180" onClick={handleClickNext}><Left /></div>
    </div>
  </div>
  <div  className='hidden md:flex items-center gap-[8px] flex-wrap mb-[16px]' ref={observedRef}>
      {
        displayedVariants.map((item: any) => {
          const isActive = url === item.node.defaultImage?.url.replace('40w', '400w');
          
          return (
            <div key={item.node.id} onClick={() => handleVariantClick(item.node.defaultImage.url)} className={`cursor-pointer border  ${isActive ? 'border border-black rounded-[6px]' : 'border-white'}`}>
              <img
                className="object-contain h-[40px] min-w-[40px]"
                src={item.node.defaultImage?.url}
              />
            </div>
          )
        })
      }
       <button
        className="w-[40px] h-[40px] flex items-center justify-center border border-BF rounded-[6px] text-[22px]"
        onClick={() => {
          setShowAll((prev) => {
            const newShowAll = !prev; 
            if (newShowAll) {
              setDisplayedVariants(variants.edges); 
            } else {
              if (width > 300) {
                setDisplayedVariants(variants.edges.slice(0, 5))
              } else if(width > 251) {
                setDisplayedVariants(variants.edges.slice(0, 4))
              } else if(width > 211) {
                setDisplayedVariants(variants.edges.slice(0, 3))
              }
            }
            return newShowAll; 
          });
        }}
      >
        
        {showAll ? <Minus className='w-[16px]'/> : <Plus className='w-[16px]'/>
 }
      </button>
  </div>
  <div className={cn('flex flex-1 flex-col gap-1', Boolean(addToCart) && 'justify-end')}>
    {subtitle ? <p className="text-base text-gray-500">{subtitle}</p> : null}
    <h3 className="text-custom-size-24 font-bold lg:text-custom-size-24">
      <Link
        className="focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary/20 focus-visible:ring-0"
        href={href}
      >
        {name}
      </Link>
    </h3>
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
