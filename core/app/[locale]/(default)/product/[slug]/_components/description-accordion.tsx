import { useTranslations } from 'next-intl';

import { Accordions } from '~/components/ui/accordions';
import { FragmentOf, graphql } from '~/client/graphql';

import { ProductSizeChart } from './product-size-chart';
// import { getWebPageContent } from ''

export const DescriptionFragment = graphql(`
  fragment DescriptionFragment on Product {
    description
    sku
  }
`);

interface Props {
  product: FragmentOf<typeof DescriptionFragment>;
  sustainability?: any;
}

export const DescriptionAccordion = ({ product, sustainability }: Props) => {
  const t = useTranslations('Product.Description');

  const accordions = [];

  if (product.description ) {
    accordions.push({
      content: (
        <div className="product-description" dangerouslySetInnerHTML={{ __html: product.description }} />
      ),
      title: t('heading'),
    })
  }

  if (product.sku) {
    accordions.push({
      content: (
        <ProductSizeChart sku={product.sku} />
      ),
      title: 'Sizing',
    })
  }

  accordions.push({
    content: (
      <div className="product-sustainability" dangerouslySetInnerHTML={{ __html: sustainability }} ></div>
    ),
    title: 'Sustainability',
  });

  return (
    <Accordions accordions={accordions} type="multiple" defaultValue={[t('heading'), 'Sizing', 'Sustainability']} />
  );
};
