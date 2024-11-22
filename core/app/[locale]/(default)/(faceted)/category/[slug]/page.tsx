import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Breadcrumbs } from '~/components/breadcrumbs';

import { fetchFacetedSearch } from '../../fetch-faceted-search';

import { CategoryViewed } from './_components/category-viewed';
import { getCategoryPageData } from './page-data';
import ClientCategoryComponent from './ClientCategoryComponent'

interface Props {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}



export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const categoryId = Number(slug);
  
  const data = await getCategoryPageData({
    categoryId,
  });

  const category = data.category;
  
  if (!category) {
    return {};
  }

  const { pageTitle, metaDescription, metaKeywords } = category.seo;

  return {
    title: pageTitle || category.name,
    description: metaDescription,
    keywords: metaKeywords ? metaKeywords.split(',') : null,
  };
}

export default async function Category(props: Props) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { locale, slug } = params;

  setRequestLocale(locale);

  const t = await getTranslations('Category');
  
  const categoryId = Number(slug);

  const [{ category, categoryTree }, search] = await Promise.all([
    getCategoryPageData({ categoryId }),
    fetchFacetedSearch({ ...searchParams, category: categoryId }),
  ]);

  if (!category) {
    return notFound();
  }

  const productsCollection = search.products;
  const products = productsCollection.items;
  const { hasNextPage, hasPreviousPage, endCursor, startCursor } = productsCollection.pageInfo;

  return (
    <div className="group">
      <Breadcrumbs category={category} />
      <ClientCategoryComponent 
      category={category} 
      productsCollection={productsCollection} 
      search ={search} 
      categoryTree ={categoryTree} 
      products={products}
      endCursor={endCursor}
      hasNextPage={hasNextPage}
      hasPreviousPage={hasPreviousPage}
      startCursor= {startCursor}
      t ={t('products')}
      />
      {/* <div className="md:mb-8 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <h1 className="flex items-center mb-4 text-40 font-bold text-xh lg:mb-0 lg:text-40">
          {category.name}
          <span className="ml-2 text-20 text-8c font-normal text-muted-foreground">
           ({productsCollection.collectionInfo?.totalItems ?? 0 })
          </span>
        </h1>

        <div className="flex flex-col items-center gap-3 whitespace-nowrap md:flex-row">
          <MobileSideNav>
            <FacetedSearch
              facets={search.facets.items}
              headingId="mobile-filter-heading"
              pageType="category"
            >
              <SubCategories categoryTree={categoryTree} />
            </FacetedSearch>
          </MobileSideNav>
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-end md:gap-6">
            <HideFilters />
            <SortBy />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-48">
        <FacetedSearch
          className="mb-8 hidden lg:block border-t border-t-qh"
          facets={search.facets.items}
          headingId="desktop-filter-heading"
          pageType="category"
        >
          <SubCategories categoryTree={categoryTree} />
        </FacetedSearch>

        <section
          aria-labelledby="product-heading"
          className="col-span-5 group-has-[[data-pending]]:animate-pulse lg:col-span-4"
        >
          <h2 className="sr-only" id="product-heading">
            {t('products')}
          </h2>

          {products.length === 0 && <EmptyState />}

          <div className="grid grid-cols-2 gap-20 lg:grid-cols-3 xl:grid-cols-4 sm:gap-20">
            {products.map((product, index) => (
              <ProductCard
                imagePriority={index <= 3}
                imageSize="wide"
                key={product.entityId}
                product={product}
              />
            ))}
          </div>

          <Pagination
            endCursor={endCursor ?? undefined}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
            startCursor={startCursor ?? undefined}
          />
        </section>
      </div> */}
      <CategoryViewed category={category} categoryId={categoryId} products={products} />
    </div>
  );
}

export const runtime = 'edge';
