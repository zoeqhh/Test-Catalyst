import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { ComponentPropsWithRef, ElementRef, forwardRef, useId } from 'react';

import { cn } from '~/lib/utils';

interface Item {
  label: string;
  value: string;
}

interface Props extends ComponentPropsWithRef<typeof RadioGroupPrimitive.Root> {
  error?: boolean;
  items: Item[];
}

const RectangleList = forwardRef<ElementRef<typeof RadioGroupPrimitive.Root>, Props>(
  ({ children, className, error = false, items, ...props }, ref) => {
    const id = useId();

    return (
      <RadioGroupPrimitive.Root
        className={cn('flex flex-wrap gap-[8px]', className)}
        orientation="horizontal"
        ref={ref}
        {...props}
      >
        {items.map((item) => {
          const { label, value, ...itemProps } = item;

          return (
            <RadioGroupPrimitive.Item
              key={`${id}-${value}`}
              {...itemProps}
              className={cn(
                'h-[48px] w-[80px] lg:w-[92px] border p-[2px] font-semibold border-gray-300 rounded-[6px] lg:border-white hover:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:border-gray-100 disabled:text-gray-500 disabled:hover:border-gray-100 data-[state=checked]:text-primary data-[state=checked]:border-primary lg:data-[state=checked]:text-black lg:data-[state=checked]:border-black data-[state=checked]:bg-gray-100',
                error &&
                  'border-error-secondary hover:border-error focus-visible:border-error-secondary focus-visible:ring-error/20 disabled:border-gray-200 data-[state=checked]:border-error-secondary',
              )}
              value={value}
            >
              {item.label}
            </RadioGroupPrimitive.Item>
          );
        })}
      </RadioGroupPrimitive.Root>
    );
  },
);

RectangleList.displayName = 'RectangleList';

export { RectangleList };
