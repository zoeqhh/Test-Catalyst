import { Slot } from '@radix-ui/react-slot';
import { Loader2 as Spinner } from 'lucide-react';
import { ComponentPropsWithRef, ElementRef, forwardRef } from 'react';

import { cn } from '~/lib/utils';

interface Props extends ComponentPropsWithRef<'button'> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'subtle' | 'icon' | 'link';
}

const Button = forwardRef<ElementRef<'button'>, Props>(
  (
    {
      asChild = false,
      children,
      className,
      variant = 'primary',
      loading,
      loadingText,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(
          'relative flex w-full min-h-[64px] items-center justify-center border-2 px-[30px] py-2.5 text-md font-semibold leading-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:border-gray-400',
          variant === 'primary' &&
            'border-primary bg-primary text-white hover:bg-white hover:text-primary disabled:bg-gray-400 disabled:hover:border-gray-400 disabled:hover:bg-gray-400',
          variant === 'secondary' &&
            'border-black bg-black text-white hover:bg-white hover:text-black disabled:text-gray-400 disabled:hover:border-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400',
          variant === 'subtle' &&
            'border-none bg-transparent  hover:bg-black hover:text-white disabled:text-gray-400 disabled:hover:bg-transparent disabled:hover:text-gray-400',
          variant === 'icon' &&
            'text-black border-none p-2.5 bg-transparent hover:bg-transparent hover:text-primary',
          variant === 'link' &&
            'text-primary underline border-none p-2.5 bg-transparent hover:bg-transparent hover:font-bold',
          className,
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <>
            <span className="absolute z-10 flex h-full w-full items-center justify-center">
              <Spinner aria-hidden="true" className="animate-spin" />
              <span className="sr-only">{loadingText}</span>
            </span>
            <span className="invisible flex items-center">{children}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);

Button.displayName = 'Button';

export { Button };
