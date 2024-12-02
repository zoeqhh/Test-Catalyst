import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { PricingFragment } from '~/client/fragments/pricing';
import { ProductItemFragment } from '~/client/fragments/product-item';
import { FragmentOf, graphql } from '~/client/graphql';

import { ProductForm } from './product-form';
import { ProductFormFragment } from './product-form/fragment';
import { ProductSchema, ProductSchemaFragment } from './product-schema';

export const DetailsFragment = graphql(
  `
    fragment DetailsFragment on Product {
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
    }
  `,
  [
    ProductSchemaFragment,
    ProductFormFragment,
    ProductItemFragment,
    PricingFragment,
  ],
);

interface Props {
  product: FragmentOf<typeof DetailsFragment>;
}

export const Details = ({ product }: Props) => {
  const customFields = removeEdgesAndNodes(product.customFields);

  return (
    <div>
      <div className="mb-5 hidden lg:block">
        <h2 className="text-2xl font-bold">{product.name}</h2>

        {Boolean(customFields) &&
          customFields.map((customField) => {
            if (
              customField.name === 'attribute_1' ||
              customField.name === 'attribute_2' ||
              customField.name === 'attribute_3'
            ) return (
              <div className={customField.name === 'attribute_1' ? 'font-medium text-lg mb-[8px]' : 'text-sm'} key={customField.entityId}>
                <p>{customField.value.replace(/m�/, '㎡')}</p>
              </div>
            )
          })
        }
      </div>

      <ProductForm data={product} />

      <ProductSchema product={product} />
    </div>
  );
};
