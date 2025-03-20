import { notFound } from 'next/navigation';
import { eq, and, isNull } from 'drizzle-orm';
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";
import Invoice from './Invoice';

//import { NextPage, NextPageContext } from 'next';

interface PageProps {
  params: Promise<{ invoiceId: string }>;
}

export default async function InvoicePage({ params }: PageProps) {
  const { userId, orgId } = await auth();

  if (!userId) return;

  const paramsObj = await params;
  const { invoiceId } = paramsObj;
  const invoiceIdInt = parseInt(invoiceId);

  if (isNaN(invoiceIdInt)) {
    return notFound();
  }

  let result;

  if (orgId) {
    [result] = await db.select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceIdInt),
          eq(Invoices.organizationId, orgId)
        )
      )
      .limit(1)
  } else {
    [result] = await db.select()
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(
        and(
          eq(Invoices.id, invoiceIdInt),
          eq(Invoices.userId, userId),
          isNull(Invoices.organizationId)
        )
      )
      .limit(1)

  }



  if (!result) {
    notFound()
  }

  const invoice = {
    ...result.invoices,
    customer: result.customers
  }

  return <Invoice invoice={invoice} />;
}
