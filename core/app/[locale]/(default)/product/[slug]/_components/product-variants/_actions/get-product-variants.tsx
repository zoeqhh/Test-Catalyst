'use server';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

import { CheckboxFieldFragment } from '../../product-form/fields/checkbox-field/fragment';
import { DateFieldFragment } from '../../product-form/fields/date-field/fragment';
import { MultiLineTextFieldFragment } from '../../product-form/fields/multi-line-text-field/fragment';
import { MultipleChoiceFieldFragment } from '../../product-form/fields/multiple-choice-field/fragment';
import { NumberFieldFragment } from '../../product-form/fields/number-field/fragment';
import { TextFieldFragment } from '../../product-form/fields/text-field/fragment';

const ProductVariantsQuery = graphql(
  `
    query ProductVariantsQuery($entityId: Int!, $endCursor: String,) {
      site {
        product(entityId: $entityId) {
          entityId
          productOptions(first: 10) {
            edges {
              node {
                __typename
                entityId
                displayName
                isRequired
                isVariantOption
                ...MultipleChoiceFieldFragment
                ...CheckboxFieldFragment
                ...NumberFieldFragment
                ...TextFieldFragment
                ...MultiLineTextFieldFragment
                ...DateFieldFragment
              }
            }
          }
          variants(isPurchasable: true, first: 50, after: $endCursor) {
            edges {
              node {
                entityId
                sku
                prices {
                  price {
                    value
                    currencyCode
                  }
                }
                options {
                  edges {
                    node {
                      displayName
                      entityId
                      values {
                        edges {
                          node {
                            entityId
                            label
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            pageInfo {
              endCursor
              hasNextPage
            }
          }
        }
      }
    }
  `,
  [
    MultipleChoiceFieldFragment,
    CheckboxFieldFragment,
    NumberFieldFragment,
    TextFieldFragment,
    MultiLineTextFieldFragment,
    DateFieldFragment,
  ],
);

export const getProductVariantsData = async (productId: number, endCursor?: string | null | undefined) => {
  const customerAccessToken = await getSessionCustomerAccessToken();
  try {
    const { data } = await client.fetch({
      document: ProductVariantsQuery,
      variables: {
        entityId: productId,
        endCursor,
      },
      customerAccessToken,
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
    });

    const product = data.site.product;

    if (!product) {
      return { status: 'error', error: 'No results found' };
    }

    return {
      status: 'success',
      data: {
        options: removeEdgesAndNodes(product.productOptions),
        variants: removeEdgesAndNodes(product.variants),
        pageInfo: product.variants.pageInfo,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
};
