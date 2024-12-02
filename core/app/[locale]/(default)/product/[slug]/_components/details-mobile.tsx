import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';

import { FragmentOf, graphql } from '~/client/graphql';

export const DetailsMobileFragment = graphql(
  `
    fragment DetailsMobileFragment on Product {
      entityId
      name
      sku
      upc
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
    }
  `);

interface Props {
  product: FragmentOf<typeof DetailsMobileFragment>;
}

export const DetailsMobile = ({ product }: Props) => {
  const customFields = removeEdgesAndNodes(product.customFields);

  return (
    <div className="mb-5 lg:hidden">
      <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>
      {Boolean(customFields) &&
        customFields.map((customField) => {
          if (
            customField.name === 'attribute_1' ||
            customField.name === 'attribute_2' ||
            customField.name === 'attribute_3'
          ) return (
            <div className={customField.name === 'attribute_1' ? 'font-medium mb-2' : 'text-sm'} key={customField.entityId}>
              <p>{customField.value.replace(/m�/, '㎡')}</p>
            </div>
          )
        })
      }
    </div>
  );
};
