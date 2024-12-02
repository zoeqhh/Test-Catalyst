import { ResultOf } from '~/client/graphql';
import { CarouselProducts } from '~/components/ui/carousel-products';

import { ProductCard } from '../product-card';

import { ProductCardCarouselFragment } from './fragment';

type Product = ResultOf<typeof ProductCardCarouselFragment>;

export const ProductCardCarousel = ({
  title,
  products,
  showCart,
  showCompare,
  needImagesSlider,
}: {
  title: string;
  products: Product[];
  showCart?: boolean;
  showCompare?: boolean;
  needImagesSlider?: boolean;
}) => {
  if (products.length === 0) {
    return null;
  }

  const items = products.map((product) => (
    <ProductCard
      className="group flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333333%] mb-[64px] pr-4"
      imageSize="wide"
      key={product.entityId}
      product={product}
      showCart={showCart}
      showCompare={showCompare}
      needImagesSlider={needImagesSlider}
    />
  ));

  return <CarouselProducts className="mb-14" products={items} title={title} />;
};
