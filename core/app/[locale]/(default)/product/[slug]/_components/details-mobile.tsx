import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useTranslations } from 'next-intl';

import { PricingFragment } from '~/client/fragments/pricing';
import { ProductItemFragment } from '~/client/fragments/product-item';
import { FragmentOf, graphql } from '~/client/graphql';

import { ProductForm } from './product-form';
import { ProductFormFragment } from './product-form/fragment';
import { ProductSchema, ProductSchemaFragment } from './product-schema';
import { ReviewSummary, ReviewSummaryFragment } from './review-summary';

export const DetailsFragment = graphql(
  `
    fragment DetailsFragment on Product {
      ...ReviewSummaryFragment
      ...ProductSchemaFragment
      ...ProductFormFragment
      ...ProductItemFragment
      entityId
      name
      sku
      upc
      minPurchaseQuantity
      maxPurchaseQuantity
      condition
      weight {
        value
        unit
      }
      availabilityV2 {
        description
      }
      customFields {
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
    }
  `,
  [
    ReviewSummaryFragment,
    ProductSchemaFragment,
    ProductFormFragment,
    ProductItemFragment,
    PricingFragment,
  ],
);

interface Props {
  product: FragmentOf<typeof DetailsFragment>;
}

export const DetailsMobile = ({ product }: Props) => {
  const customFields = removeEdgesAndNodes(product.customFields);

  return (
    <div className="mb-6 lg:hidden">
      <h1 className="mb-2 text-4xl font-black lg:text-5xl">{product.name}</h1>
      {Boolean(customFields) &&
        customFields.map((customField) => {
          if (
            customField.name === 'attribute_1' ||
            customField.name === 'attribute_2' ||
            customField.name === 'attribute_3'
          ) return (
            <div className={customField.name === 'attribute_1' ? 'font-medium mb-2' : ''} key={customField.entityId}>
              <p>{customField.value.replace(/m�/, '㎡')}</p>
            </div>
          )
        })
      }
    </div>
  );
};
