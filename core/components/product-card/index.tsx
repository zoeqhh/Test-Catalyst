import { useFormatter } from 'next-intl';

import { ResultOf } from '~/client/graphql';
import { ProductCard as ComponentProductCard } from '~/components/ui/product-card';
import { pricesTransformer } from '~/data-transformers/prices-transformer';

import { AddToCart } from './add-to-cart';
import { ProductCardFragment } from './fragment';

interface Props {
  className?: string;
  product: ResultOf<typeof ProductCardFragment>;
  imageSize?: 'tall' | 'wide' | 'square';
  imagePriority?: boolean;
  showCompare?: boolean;
  showCart?: boolean;
  needImagesSlider?: boolean;
}

export const ProductCard = ({
  className,
  product,
  imageSize = 'square',
  imagePriority = false,
  showCart = true,
  showCompare = true,
  needImagesSlider = false,
}: Props) => {
  const format = useFormatter();

  const { name, entityId, defaultImage, brand, path, prices, customFields, images, options } = product;

  const price = pricesTransformer(prices, format);

  return (
    <ComponentProductCard
      addToCart={showCart && <AddToCart data={product} />}
      className={className}
      href={path}
      id={entityId.toString()}
      image={defaultImage ? { src: defaultImage.url, altText: defaultImage.altText } : undefined}
      imagePriority={imagePriority}
      imageSize={imageSize}
      name={name}
      price={price}
      customFields={customFields}
      images={images}
      options={options}
      showCompare={showCompare}
      subtitle={brand?.name}
      needImagesSlider={needImagesSlider}
    />
  );
};
