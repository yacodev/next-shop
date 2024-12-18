/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { auth } from '@/auth.config';
import { Address, Size } from '@/interfaces';
import prisma from '@/lib/prisma';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth();

  //validate user
  const userId = session?.user.id;
  if (!userId) {
    return {
      ok: false,
      message: 'User not found',
    };
  }

  //get products information
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((p) => p.productId),
      },
    },
  });

  //calculate total
  const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

  const { subTotal, tax, total } = productIds.reduce(
    (totals, item) => {
      const productQuantity = item.quantity;
      const product = products.find((p) => p.id === item.productId);

      if (!product) throw new Error('Product not found');

      const subTotal = product.price * productQuantity;
      totals.subTotal += subTotal;
      totals.tax += subTotal * 0.15;
      totals.total += subTotal * 1.15;
      return totals;
    },
    { subTotal: 0, tax: 0, total: 0 }
  );

  //create transaction
  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Update  products stock

      const updatedProductsPromises = products.map((product) => {
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => acc + item.quantity, 0);

        if (productQuantity === 0) {
          throw new Error('Product quantity is 0');
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      // check if products have negative stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error('Product out of stock');
        }
      });

      // 2. Create order - details
      const order = await tx.order.create({
        data: {
          userId,
          itemsInOrder: itemsInOrder,
          subTotal,
          tax,
          total,
          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                size: p.size,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });
      // 3. Create address
      const { country, ...restAddress } = address;
      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        updatedProducts,
        orderAddress,
      };
    });

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx,
    };
  } catch (e: any) {
    return {
      ok: false,
      message: e.message,
    };
  }
};
