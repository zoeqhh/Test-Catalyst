import { GalleryFragment } from '~/app/[locale]/(default)/product/[slug]/_components/gallery/fragment';
import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';

import { AddToCartFragment } from './add-to-cart/fragment';

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      options {
        edges {
          node {
            displayName
            entityId
            isRequired
            values {
              edges {
                node {
                  label
                  entityId
                }
              }
            }
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
      path
      brand {
        name
        path
      }
      reviewSummary {
        numberOfReviews
        averageRating
      }
      ...AddToCartFragment
      ...PricingFragment
      ...GalleryFragment
    }
  `,
  [AddToCartFragment, PricingFragment, GalleryFragment],
);
