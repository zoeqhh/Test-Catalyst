import { ProductFormFragment } from '~/app/[locale]/(default)/product/[slug]/_components/product-form/fragment';
import { GalleryFragment } from '~/app/[locale]/(default)/product/[slug]/_components/gallery/fragment';
import { graphql } from '~/client/graphql';
import { BreadcrumbsFragment } from '~/components/breadcrumbs/fragment';

import { PricingFragment } from './pricing';

export const ProductItemFragment = graphql(
  `
    fragment ProductItemFragment on Product {
      entityId
      name
      sku
      categories(first: 1) {
        edges {
          node {
            ...BreadcrumbsFragment
          }
        }
      }
      customFields(first: 50) {
        edges {
          node {
            entityId
            name
            value
          }
        }
      }
      brand {
        name
      }
      ...PricingFragment
      ...ProductFormFragment
      ...GalleryFragment
    }
  `,
  [BreadcrumbsFragment, PricingFragment, ProductFormFragment, GalleryFragment],
);
