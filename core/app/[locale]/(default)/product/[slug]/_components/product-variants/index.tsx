'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProductVariantsData } from './_actions/get-product-variants';
import { handleAddToCart } from './_actions/add-to-cart';
import { ProductVariantsTable } from './product-variants-table';
import { useTranslations } from 'next-intl';
import { Button } from '~/components/ui/button';
import { useCart } from '~/components/header/cart-provider';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

interface Props {
  productId: number;
}

export const ProductVariants = ({ productId }: Props) => {
  const t = useTranslations('Components.AddToCartButton');

  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [endCursor, setEndCursor] = useState<string>('');
  const [skus, setSkus] = useState<string>('');
  const [inventory, setInventory] = useState<any[]>([]);

  const [colorId, setColorId] = useState<number>();
  const [colors, setColors] = useState<any[]>([]);
  const [sizeId, setSizeId] = useState<number>();
  const [sizes, setSizes] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [variants, setVariants] = useState<any[]>([]);

  const [totalQuantity, setTotalQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [lintItems, setLintItems] = useState<any[]>([]);

  const getProductVariants = useMemo(
    () =>
      async (productId: number, endCursor?: string) => {
        const { data } = await getProductVariantsData(productId, endCursor);

        if (data) {
          if (options.length !== data.options.length) {
            setOptions(data.options);
          }

          setVariants((prevVariants: any) => [...prevVariants, ...data.variants]); // 将新数据添加到现有数据中
          setHasNextPage(data.pageInfo.hasNextPage);

          const newSkus = data.variants.map(variant => (`skus=${variant.sku}`)).join('&')
          setSkus(newSkus);

          if (data.pageInfo.hasNextPage && data.pageInfo.endCursor) {
            setEndCursor(data.pageInfo.endCursor);
          }
        }
      },
    [options, getProductVariantsData],
  );

  const fetchProductVariants = useCallback(
    async (productId: number, endCursor?: string) => getProductVariants(productId, endCursor),
    [getProductVariants]
  )

  const onVariantsQuantityChange = (qty: number | '', sku: string) => {
    setVariants(preVariants => {
      return preVariants.map((variant) => {
        let newVariant: any = variant;
        if (variant.sku === sku) {
          newVariant = Object.assign(variant, { quantity: qty })
        }
        return newVariant;
      })
    })
  }

  const addVariants = async () => {
    console.log(1111222, lintItems);
    const cart = useCart();
    console.log(1111222, cart);
    // Optimistic update
    cart.increment(totalQuantity);

    toast.success(
      () => (
        <div className="flex items-center gap-3">
          <span>
            {t.rich('success', {
              cartItems: quantity,
              cartLink: (chunks) => (
                <Link
                  className="font-semibold text-primary hover:text-primary"
                  href="/cart"
                  prefetch="viewport"
                  prefetchKind="full"
                >
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </div>
      ),
      { icon: <Check className="text-success-secondary" /> },
    );

    const result = await handleAddToCart(lintItems);
    console.log(1111222, result);

    if (result && result.error) {
      toast.error(t('error'), {
        icon: <AlertCircle className="text-error-secondary" />,
      });

      cart.decrement(totalQuantity);

      return;
    }

    // bodl.cart.productAdded({
    //   product_value: totalPrice,
    //   currency: transformedProduct.currency,
    //   line_items: lintItems,
    // });
  }

  useEffect(() => {
    options.forEach((option: any) => {
      const optionName = option.displayName.toLowerCase();
      if (
        optionName === 'color' ||
        optionName === 'colour' ||
        optionName === 'colors' ||
        optionName === 'colours'
      ) {
        setColorId(option.entityId);
        setColors([...removeEdgesAndNodes(option.values)].sort((a: any, b: any) => a.label.localeCompare(b.label)))
      }
      if (optionName === 'size') {
        const order = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'];
        setSizeId(option.entityId);
        setSizes([...removeEdgesAndNodes(option.values)].sort((a: any, b: any) => {
          return order.indexOf(a.label.toUpperCase()) - order.indexOf(b.label.toUpperCase());
        }));
      };
    });
  }, [options, setColorId, setColors, setSizeId, setSizes]);

  useEffect(() => {
    let newTotalQuantity: number = 0;
    let newTotalPrice: number = 0;
    let newLintItems: any[] = [];

    variants.forEach(variant => {
      if (variant.quantity) {
        newTotalQuantity += variant.quantity;

        if (variant.prices.price.value) {
          newTotalPrice+= variant.quantity * variant.prices.price.value;
        }

        newLintItems.push({
          productEntityId: productId,
          selectedOptions: variant.optionSelections,
          quantity: variant.quantity,
        })
      }
    });

    setTotalQuantity(newTotalQuantity);
    setTotalPrice(newTotalPrice);
    setLintItems(newLintItems);
  }, [variants, setTotalQuantity, setTotalPrice, setLintItems]);

  useEffect(() => {
    if (hasNextPage) {
      fetchProductVariants(productId, endCursor);
    }
  }, [productId, endCursor, hasNextPage, fetchProductVariants]);

  useEffect(() => {
    if (skus) {
      fetch(`https://fn-api-prod-aus.azurewebsites.net/api/getInventoryFromCosmos?code=1zcyvpFlVzTUgnVJBCvV6cb80ltPUlqMHw4IeqmNhtVapeuh5r/tVg==&${skus}`)
        .then(response => response.json())
        .then(response => {
          const { inventory } = response;
          setInventory(inventory);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [skus, setInventory]);

  useEffect(() => {
    if (inventory?.length) {
      setVariants(preVariants => {
        return preVariants.map((variant) => {
          const current = inventory.find((item) => item.id === variant.sku);

          const optionSelections: any[] = removeEdgesAndNodes(variant.options).map((option: any) => {
            const optionValues = removeEdgesAndNodes(option.values).map((value: any) => value.entityId);
            return {
              optionId: option.entityId,
              optionValue: optionValues[0],
            }
          })

          const onHand = current?.on_hand || null;

          let placeholder: number | string = onHand;

          if (onHand < 12) placeholder = 0;
          if (onHand > 1000) placeholder = '1000+';

          return {
            quantity: '',
            stock: onHand,
            dueDate: current?.due_date || null,
            optionSelections,
            placeholder,
            ...variant
          }
        })
      })
    }
  }, [inventory, setVariants]);

  if (!options.length) return;

  return (
    <div className="xl:grid grid-cols-3 mb-[140px]">
      <div className="xl:col-span-2">
        <h2 className="text-3xl font-black uppercase my-5 lg:text-4xl">Bulk Ordering Grid</h2>
        <p className="mb-3">Inventory available is shown by piece. Enter your quantity to begin order.</p>
        <ProductVariantsTable
          colorId={colorId}
          colors={colors}
          sizeId={sizeId}
          sizes={sizes}
          options={options}
          variants={variants}
          onVariantsQuantityChange={onVariantsQuantityChange}
        />
        <div className='variants-totalPrice flex items-center my-4'>
          <span className="mr-1">TotalPrice: </span>
          <span className='text-primary text-2xl font-bold mr-3'>${totalPrice.toFixed(2)}</span>
          <span className='underline'>View Pricing Tiers</span>
        </div>
        <Button loadingText={t('processing')} type="button" className='max-w-[236px]' onClick={addVariants}>{t('addToCart')}</Button>
      </div>
    </div>
  )
};
