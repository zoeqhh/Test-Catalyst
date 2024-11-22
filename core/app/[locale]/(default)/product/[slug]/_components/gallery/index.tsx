'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { FragmentOf } from '~/client/graphql';
import { GalleryCustom as ComponentsGallery } from '~/components/ui/gallery-custom';
import { CarouselImages as ComponentsCarousel } from '~/components/ui/carousel-images';

import { GalleryFragment } from './fragment';

interface Props {
  product: FragmentOf<typeof GalleryFragment>;
  selectedColor?: string;
}

export const Gallery = ({ product, selectedColor }: Props) => {
  let images = removeEdgesAndNodes(product.images);

  // Pick the top-level default image
  const topLevelDefaultImg = images.find((image) => image.isDefault);

  // If product.defaultImage exists, and product.defaultImage.url is not equal to the url of the isDefault image in images,
  // mark the existing isDefault image to "isDefault = false" and append the correct default image to images
  if (product.defaultImage && topLevelDefaultImg?.url !== product.defaultImage.url) {
    images.forEach((image) => {
      image.isDefault = false;
    });

    images.push({
      url: product.defaultImage.url,
      altText: product.defaultImage.altText,
      isDefault: true,
    });
  }

  // const defaultImageIndex = images.findIndex((image) => image.isDefault);

  images = images.filter(image => (
    image.altText.toLowerCase().indexOf(`(${selectedColor})`) !== -1
  ))

  return (
    <div className="-mx-6 mb-10 sm:-mx-0 md:mb-12">
      <div className="lg:sticky lg:top-0">
        <div className="hidden lg:block">
          <ComponentsGallery
            images={images.map((image) => ({ src: image.url, altText: image.altText }))}
          />
        </div>
        <div className="lg:hidden">
          <ComponentsCarousel
            images={images.map((image) => ({ src: image.url, altText: image.altText }))}
          />
        </div>
      </div>
    </div>
  );
};
