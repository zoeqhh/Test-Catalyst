import { useCallback } from 'react';

import { Quantity } from '~/components/ui/form';

interface Props {
  colorId?: number;
  colors?: any[];
  sizeId?: number;
  sizes?: any[];
  options?: string[];
  variants?: string[];
  onVariantsQuantityChange?: (qty: number | '', sku: string) => void;
}

const ProductVariantsTable = ({ colorId, colors, sizeId, sizes, options, variants, onVariantsQuantityChange }: Props) => {

  const getCurrentVariant = useCallback(
    (optionSelections: any[]) => {
      const arr1 = [...optionSelections].sort((a, b) => a.optionId - b.optionId);
      const current: any = variants.find((variant: any) => {
        if (variant.optionSelections) {
          const arr2 = [...variant.optionSelections].sort((a, b) => a.optionId - b.optionId);

          if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
            return variant
          }
        }
      })

      if (current) return current;
    },
    [variants]
  );

  return (
    <div className='overflow-x-auto'>
      <table className='table-fixed w-full min-w-[700px]'>
        <thead>
          <tr>
            <th className='product-colors font-normal p-2 text-primary text-[15px] text-left w-1/4'>Colour</th>
            { sizes && sizes.map((size: any) => (
                <th className='font-normal p-2 text-primary text-[15px]' key={size.entityId}>{size.label}</th>
              ))
            }
          </tr>
        </thead>
        <tbody>
          { colors.map((color: any) => (
            <tr key={color.entityId}>
              <th className='font-normal p-2 text-gray-600 text-sm text-left w-1/4 border border-l-0 border-gray-300'>
                <div className='flex items-center justify-items-center'>
                  <div className={`rounded-full overflow-hidden flex items-stretch w-[29px] h-[29px] mr-2 ${color.label.toLowerCase() === 'white' ? 'border' : ''}`}>
                  {Boolean(color.hexColors) && color.hexColors.map((hex: string) => (
                    <span className={`flex-1`} key={hex} style={{ backgroundColor: hex }}></span>
                  ))}
                  </div>
                  <span>{color.label}</span>
                </div>
              </th>
              { sizes && sizes.map((size: any) => {
                const optionsSelections = [
                  {
                    optionId: colorId,
                    optionValue: color.entityId,
                  },
                  {
                    optionId: sizeId,
                    optionValue: size.entityId,
                  },
                ];
                const variant = getCurrentVariant(optionsSelections);

                if (variant) {
                  const {
                    entityId: variantId,
                    sku: variantSku,
                    placeholder,
                  } = variant;

                  return (
                    <td className='product-variant text-gray-500 font-normal border border-gray-300 bg-gray-200' key={variantId}>
                      <div className='variant-quantity group relative'>
                        {placeholder === 0 && (
                          <div className='out-of-stock w-auto text-xs text-center whitespace-nowrap px-2 py-1 bg-white border shadow-md absolute top-0 left-1/2 -translate-y-3/4 -translate-x-1/2 rounded z-10 after:content-[" "] after:w-[8px] after:h-[8px] after:bg-white after:rotate-45 after:-mt-[4px] after:-ml-[4px] after:absolute after:top-full after:left-1/2 hidden group-hover:block'>Out of stock</div>
                        )}
                        <Quantity
                          className={`variant-quantity ${placeholder === 0 ? 'placeholder:text-gray-300' :''}`}
                          sku={variantSku}
                          placeholder={placeholder}
                          id={`quantity-${variantSku}`}
                          name="variant-quantity"
                          onChange={onVariantsQuantityChange}
                        />
                      </div>
                    </td>
                  )
                } else {
                  return (
                    <td className='text-gray-500 font-normal border border-gray-300 bg-gray-200' key={`${color.entityId}${size.entityId}`}></td>
                  )
                }
               })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { ProductVariantsTable };
