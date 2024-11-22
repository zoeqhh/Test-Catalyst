import { PricingFragment } from '~/client/fragments/pricing';
import { graphql } from '~/client/graphql';

import { AddToCartFragment } from './add-to-cart/fragment';

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate(lossy: true)
      }
      variants {
        edges {
          node {
              id
              defaultImage {
              url(width: 40)
              }
                      }
                    }
                  },
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
    }
  `,
  [AddToCartFragment, PricingFragment],
);
