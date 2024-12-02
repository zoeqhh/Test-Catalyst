import {
  ComponentPropsWithRef,
  ElementRef,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { cn } from '~/lib/utils';

interface Props extends Omit<ComponentPropsWithRef<'input'>, 'onChange'> {
  sku?: string;
  error?: boolean;
  defaultValue?: number | '';
  isInteger?: boolean;
  max?: number;
  min?: number;
  step?: number;
  value?: number | '';
  placeholder?: '';
  onChange?: (value: number | '', sku: string) => void;
}

const getDefaultValue = (defaultValue: number | '', min: number, max: number) => {
  if (typeof defaultValue === 'number') {
    if (defaultValue < min) {
      return min;
    } else if (defaultValue > max) {
      return max;
    }
  }

  return defaultValue;
};

type QuantityRef = ElementRef<'input'> | null;

const Quantity = forwardRef<ElementRef<'input'>, Props>(
  (
    {
      children,
      className,
      sku = '',
      defaultValue = '',
      disabled = false,
      error = false,
      isInteger = true,
      max = Infinity,
      min = 0,
      step = 1,
      placeholder,
      onChange,
      type,
      value: valueProp,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<number | ''>(getDefaultValue(defaultValue, min, max));
    const inputRef = useRef<QuantityRef>(null);

    useImperativeHandle<QuantityRef, QuantityRef>(ref, () => inputRef.current);

    const updateValue = (newValue: number | '', sku: string) => {

      if (newValue === 0) {
        setValue('');
      } else {
        setValue(newValue);
      }

      if (onChange) {
        onChange(newValue, sku);
      }
    };
    const currValue = valueProp ?? value;

    return (
      <input
        className={cn(
          'text-center text-black p-2 rounded-none bg-transparent hover:bg-white focus:bg-white',
          className,
        )}
        disabled={disabled}
        max={max}
        min={min}
        onBlur={(e) => {
          const valueAsNumber = e.target.valueAsNumber;

          if (Number.isNaN(valueAsNumber)) {
            updateValue(min, sku);

            return;
          }

          if (valueAsNumber < min) {
            updateValue(min, sku);
          } else if (valueAsNumber > max) {
            updateValue(max, sku);
          }
        }}
        onChange={(e) => {
          const valueAsNumber =
            isInteger && !Number.isNaN(e.target.valueAsNumber)
              ? Math.trunc(e.target.valueAsNumber)
              : e.target.valueAsNumber;

          updateValue(Number.isNaN(valueAsNumber) ? '' : valueAsNumber, sku);
        }}
        ref={inputRef}
        step={step}
        type='number'
        placeholder={placeholder}
        value={currValue}
        {...props}
      />
    );
  },
);

Quantity.displayName = 'Quantity';

export { Quantity };
