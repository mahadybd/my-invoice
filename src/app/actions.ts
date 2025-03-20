"use server";

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Customers, Invoices, Status } from "@/db/schema";
import { db } from "@/db";
import { and, eq, isNull } from "drizzle-orm";
import Stripe from 'stripe';
import { Resend } from 'resend';
import InvoiceCreatedEmail from "@/emails/invoice-created";

// const host = process.env.HOST;
// const port = process.env.PORT;

const host = process.env.VERCEL_URL || process.env.HOST;
const port = process.env.PORT || 3000;

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));
const resend = new Resend(process.env.RESEND_API_KEY);

export async function createAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const value = Math.floor(
    Number.parseFloat(String(formData.get("value"))) * 100
  );
  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
      organizationId: orgId || null,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      description,
      userId,
      customerId: customer.id,
      status: "open",
      organizationId: orgId || null,
    })
    .returning({
      id: Invoices.id,
    });

  console.log('result [0] ID:', results[0].id);

  try {
    await resend.emails.send({
      from: 'Mahady Hasan <info@mahady.online>',
      to: ['marofbd@gmail.com'],
      subject: 'You have a new invoice',
      react: InvoiceCreatedEmail({ invoiceId: results[0].id }),
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }

  // if (!customer?.id) throw new Error("Customer creation failed!");
  // if (!results || results.length === 0) throw new Error("Invoice creation failed!");

  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;

  const invoiceId = Number.parseInt(id); // Ensure id is parsed as an integer

  let results;
  if (orgId) {
    results = await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, invoiceId), // Use the parsed integer
          eq(Invoices.organizationId, orgId)
        )
      );
  } else {
    results = await db
      .update(Invoices)
      .set({ status })
      .where(
        and(
          eq(Invoices.id, invoiceId), // Use the parsed integer
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  if (!results) {
    throw new Error("Failed to update invoice status");
  }

  // Revalidate the page
  // return NextResponse.rewrite(`${host}:${port}/invoices/${invoiceId}`);
  const response = NextResponse.rewrite(`${host}:${port}/invoices/${invoiceId}`);
  return JSON.parse(JSON.stringify(response)); // Update this line
}

export async function deleteInvoiceAction(formData: FormData) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;

  let results;
  if (orgId) {
    results = await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.organizationId, orgId)
        )
      );
  } else {
    results = await db
      .delete(Invoices)
      .where(
        and(
          eq(Invoices.id, parseInt(id)),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      );
  }

  if (!results) {
    throw new Error("Failed to delete invoice");
  }

  redirect("/dashboard");
}

export async function createPayment(formData: FormData) {
  const headersList = await headers();
  const origin = headersList.get('origin');

  const id = Number.parseInt(formData.get('id') as string);

  const [result] = await db.select()
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  console.log('Invoice data:', result);

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product: 'prod_RssqFp2MAkJGb2',
          unit_amount: result.value,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!session.url) {
    throw new Error("Invalid session");
  }

  redirect(session.url);
}