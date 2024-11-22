import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { Breadcrumbs } from '~/components/breadcrumbs';

import { Description } from './_components/description';
import { DetailsMobile } from './_components/details-mobile';
import { Details } from './_components/details';
import { Gallery } from './_components/gallery';
import { ProductViewed } from './_components/product-viewed';
import { RelatedProducts } from './_components/related-products';
import { Reviews } from './_components/reviews';
import { Warranty } from './_components/warranty';
import { getProduct } from './page-data';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getOptionValueIds({ searchParams }: { searchParams: Awaited<Props['searchParams']> }) {
  const { slug, ...options } = searchParams;

  return Object.keys(options)
    .map((option) => ({
      optionEntityId: Number(option),
      valueEntityId: Number(searchParams[option]),
    }))
    .filter(
      (option) => !Number.isNaN(option.optionEntityId) && !Number.isNaN(option.valueEntityId),
    );
}

function getSelectColorName(optionValueIds: any, options: any) {
  let selectedColor: any;

  options.forEach((option: any) => {
    if (option.node.displayName === 'Color') {
      if (optionValueIds.length) {
        optionValueIds.forEach((optionValueId: any) => {
          if (optionValueId.optionEntityId === option.node.entityId) {
            option.node.values.edges.forEach((value: any) => {
              if (value.node.entityId === optionValueId.valueEntityId) {
                selectedColor = value.node.label.toLowerCase();
              }
            })
          }
        })
      } else {
        const defaultSelectedColor = option.node.values.edges.find((value: any) => value.node.isSelected);
        const defaultColor = option.node.values.edges.find((value: any) => value.node.isDefault);
        const firstColor = option.node.values.edges.find((value: any, index: number) => index === 0);
        const currentColor = defaultSelectedColor || defaultColor || firstColor;
        selectedColor = currentColor.node.label.toLowerCase();
      }
    }
  })

  return selectedColor;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const productId = Number(params.slug);
  const optionValueIds = getOptionValueIds({ searchParams });

  const product = await getProduct({
    entityId: productId,
    optionValueIds,
    useDefaultOptionSelections: true,
  });

  if (!product) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = product.seo;
  const { url, altText: alt } = product.defaultImage || {};

  return {
    title: pageTitle || product.name,
    description: metaDescription || `${product.plainTextDescription.slice(0, 150)}...`,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
    openGraph: url
      ? {
          images: [
            {
              url,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function Product(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const { locale, slug } = params;

  setRequestLocale(locale);

  const t = await getTranslations('Product');

  const productId = Number(slug);

  const optionValueIds = getOptionValueIds({ searchParams });

  const product = await getProduct({
    entityId: productId,
    optionValueIds,
    useDefaultOptionSelections: true,
  });

  if (!product) {
    return notFound();
  }

  const selectedColor = getSelectColorName(optionValueIds, product.productOptions.edges);

  const category = removeEdgesAndNodes(product.categories).at(0);

  return (
    <>
      {category && <Breadcrumbs category={category} />}

      <div className="mb-12 mt-4 lg:grid lg:grid-cols-3 lg:gap-8">
        <DetailsMobile product={product} />
        <div className="lg:col-span-2">
          <Gallery product={product} selectedColor={selectedColor} />
        </div>
        <div className="lg:col-span-1">
          <Details product={product} />
          <Description product={product} />
          <Warranty product={product} />
          <Suspense fallback={t('loading')}>
            <Reviews productId={product.entityId} />
          </Suspense>
        </div>
      </div>

      <Suspense fallback={t('loading')}>
        <RelatedProducts productId={product.entityId} />
      </Suspense>

      <ProductViewed product={product} />
    </>
  );
}

export const runtime = 'edge';
