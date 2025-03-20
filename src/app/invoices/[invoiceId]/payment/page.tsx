import { Customers, Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils';
import Container from '@/components/Container';
import { eq } from 'drizzle-orm';
import { db } from "@/db";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { createPayment, updateStatusAction } from "@/app/actions";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_API_SECRET));

interface InvoicePageProps {
  params: Promise<{ invoiceId: string; }>;
  searchParams: Promise<{
    status: string;
    session_id: string;
  }>;
}

export default async function InvoicePage({ params, searchParams }: InvoicePageProps) {

  const { invoiceId } = await params;
  const invoiceIdNum = parseInt(invoiceId);
  const { status, session_id } = await searchParams; // await need to fixed the problem

  const sessionId = session_id;
  const isSuccess = sessionId && status === 'success';
  const isCanceled = status === 'canceled';
  let isError = (isSuccess && !sessionId);

  console.log('isSuccess', isSuccess);
  console.log('isCanceled', isCanceled);

  if (isNaN(invoiceIdNum)) {
    throw new Error('Invalid invoice id');
  }

  // Handle payment success
  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(sessionId);

    if (payment_status !== 'paid') {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append('id', String(invoiceIdNum)); // Ensure invoiceId is a valid number
      formData.append('status', 'paid');
      await updateStatusAction(formData);
    }

  }

  // Fetch invoice data
  let result;
  try {
    [result] = await db.select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name
    })
      .from(Invoices)
      .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
      .where(eq(Invoices.id, invoiceIdNum))
      .limit(1);
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Failed to fetch invoice data");
  }

  if (!result) {
    notFound();
  }

  const invoice = {
    ...result,
    customer: {
      name: result.name
    }
  };



  return (
    <main className="w-full h-full gap-6">

      <Container>
        {
          isError && (
            <p className="bg-red-100 text-red-800 text-center text-sm py-2 mb-4 rounded-lg">
              Someting went wrong, please try again.
            </p>
          )}
        {
          isCanceled && (
            <p className="bg-yellow-100 text-yellow-800 text-center text-sm py-2 mb-4 rounded-lg">
              Payment was canceled, please try again.
            </p>
          )}
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="flex items-center gap-4 text-3xl font-semibold">
                Invoice {invoice.id}
                <Badge className={cn(
                  "rounded-full capitalize",
                  invoice.status === 'open' && 'bg-blue-500',
                  invoice.status === 'paid' && 'bg-green-500',
                  invoice.status === 'void' && 'bg-zinc-500',
                  invoice.status === 'uncollectable' && 'bg-red-500',
                )}>
                  {invoice.status}
                </Badge>
              </h1>
            </div>
            <p className='text-3xl mb-3'>
              ${(invoice.value / 100).toFixed(2)}
            </p>
            <p className='text-lg mb-8'>
              {invoice.description}
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4"> Manage Invoice</h2>
            {invoice.status === 'open' && (
              <form action={createPayment}>
                <input type="hidden" name="id" value={invoice.id} />
                <Button className="flex gap-2 bg-green-600 font-bold">
                  <CreditCard className="w-5 h-auto" />
                  Pay Invoice
                </Button>
              </form>
            )}
            {invoice.status === 'paid' && (
              <p className="flex gap-2 items-center text-xl font-bold">
                <Check className="w-8 h-auto bg-green-500 rounded-full text-white p-1" />
                Invoice paid</p>
            )}
          </div>
        </div>
        <h2 className="font-bold text-lg mb-4">
          Billing Details
        </h2>
        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice ID</strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Invoice Date</strong>
            <span>{invoice.createTs ? new Date(invoice.createTs).toLocaleDateString() : 'N/A'}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Name</strong>
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}