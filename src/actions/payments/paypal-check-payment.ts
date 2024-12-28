'use server';
import { PayPalOrderStatusResponse } from '@/interfaces';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const authToken = await getPaypalBearerToken();
  if (!authToken) {
    return { ok: false, message: 'cant get auth token' };
  }

  const resp = await verifyPaypalPayment(paypalTransactionId, authToken);

  if (!resp) {
    return { ok: false, message: 'cant verify payment' };
  }

  const { status, purchase_units } = resp;

  const { invoice_id: orderId } = purchase_units[0];

  if (status !== 'COMPLETED') {
    return { ok: false, message: 'payment not completed' };
  }

  try {
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
      },
    });

    revalidatePath(`/orders/${orderId}`);
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, message: 'cant pay order' };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? '';

  try {
    const response = await fetch(oauth2Url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString(
          'base64'
        )}`,
      },
      body: 'grant_type=client_credentials',
      cache: 'no-store',
    });

    const data = await response.json();
    return data.access_token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const verifyPaypalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransactionId}`;

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${bearerToken}`);

  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
  };

  try {
    const resp = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: 'no-store',
    }).then((r) => r.json());
    console.log({ resp });
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};
