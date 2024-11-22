import { ChevronRight, Tally1 } from 'lucide-react';
import { Fragment } from 'react';

import { Link as CustomLink } from '~/components/link';
import { cn } from '~/lib/utils';

interface Link {
  href: string;
  label: string;
}

interface Props {
  breadcrumbs: Link[];
  className?: string;
}

const Breadcrumbs = ({ breadcrumbs, className }: Props) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ul className="flex flex-wrap items-center pt-33 pb-5">
        {breadcrumbs.map(({ label, href }, i, arr) => {
          const isLast = arr.length - 1 === i;

          return (
            <Fragment key={label}>
              <li className="flex font-medium items-center text-sm text-black">
                <CustomLink
                  aria-current={isLast ? `page` : undefined}
                  className={cn(
                    'font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20',
                    isLast && 'text-gray-700',
                  )}
                  href={href}
                >
                  {label}
                </CustomLink>
              </li>
              {!isLast ? (
                <span className="mx-2 text-custom-gray text-13 text-gray-700">
                  |
                </span>
              ) : null}
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
};

export { Breadcrumbs };
