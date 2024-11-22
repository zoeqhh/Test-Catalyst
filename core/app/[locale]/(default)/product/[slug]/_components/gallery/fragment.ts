import { graphql } from '~/client/graphql';

export const GalleryFragment = graphql(`
  fragment GalleryFragment on Product {
    images(first: 50) {
      edges {
        node {
          altText
          url: urlTemplate(lossy: true)
          isDefault
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    defaultImage {
      altText
      url: urlTemplate(lossy: true)
    }
  }
`);
