'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';

import { addCartLineItem } from '~/client/mutations/add-cart-line-item';
import { createCart } from '~/client/mutations/create-cart';
import { getCart } from '~/client/queries/get-cart';
import { TAGS } from '~/client/tags';


export async function handleAddToCart(
  lineItems: any[],
) {

  const cookieStore = await cookies();
  const cartId = cookieStore.get('cartId')?.value;

  let cart;

  if (!lineItems.length) return;

  try {
    cart = await getCart(cartId);

    if (cart) {
      cart = await addCartLineItem(cart.entityId, {
        lineItems,
      });

      if (!cart?.entityId) {
        return { status: 'error', error: 'Failed to add product to cart.' };
      }

      revalidateTag(TAGS.cart);

      return { status: 'success', data: cart };
    }

    // Create cart
    cart = await createCart(lineItems);

    if (!cart?.entityId) {
      return { status: 'error', error: 'Failed to add product to cart.' };
    }

    cookieStore.set({
      name: 'cartId',
      value: cart.entityId,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });

    revalidateTag(TAGS.cart);

    return { status: 'success', data: cart };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { status: 'error', error: error.message };
    }

    return { status: 'error', error: 'Something went wrong. Please try again.' };
  }
}
