"use client"

import { ProductCard } from "~/components/product-card";
import { Pagination } from "~/components/ui/pagination";
import { FacetedSearch } from "../../_components/faceted-search";
import { MobileSideNav } from "../../_components/mobile-side-nav";
import { SortBy } from "../../_components/sort-by";
import { EmptyState } from "./_components/empty-state";
import HideFilters from "./_components/hide-filters";
import { SubCategories } from "./_components/sub-categories";
import { useState } from "react";


export default function ClientCategoryComponent(props: any) {

  const {category, productsCollection, search, categoryTree, products,hasNextPage, hasPreviousPage, endCursor, startCursor, t} = props

  const [hideFilter, setHideFilter] = useState<boolean>(true)


  return (
    <>
        <div className="md:mb-8 lg:flex lg:flex-row lg:items-center lg:justify-between">
        <h1 className="flex items-center mb-4 text-2xl font-bold lg:mb-0 lg:text-3xl">
          {category.name}
          <span className="ml-2 text-lg text-gray-500 font-normal text-muted-foreground">
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
            <HideFilters setHideFilter={setHideFilter} hideFilter={hideFilter}/>
            <SortBy />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-48">
        {hideFilter && <FacetedSearch
          className="mb-8 hidden lg:block border-t border-t-qh"
          facets={search.facets.items}
          headingId="desktop-filter-heading"
          pageType="category"
        >
          <SubCategories categoryTree={categoryTree} />
        </FacetedSearch>}

        <section
          aria-labelledby="product-heading"
          className={`col-span-5 group-has-[[data-pending]]:animate-pulse lg:col-span-4 ${hideFilter ? '' : 'lg:col-span-5'}`}
        >
          <h2 className="sr-only" id="product-heading">
            {t}
          </h2>

          {products.length === 0 && <EmptyState />}

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
            {products.map((product: any, index: number) => (
              <ProductCard
                imagePriority={index <= 3}
                imageSize="wide"
                key={product.entityId}
                product={product}
                needImagesSlider={true}
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
      </div>
    </>
  )
}
