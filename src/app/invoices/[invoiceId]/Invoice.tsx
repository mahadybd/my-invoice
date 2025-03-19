
'use client';
import { useOptimistic } from 'react';
import { ChevronDown, CreditCard, Ellipsis, Trash } from 'lucide-react';
import { Customers, Invoices } from "@/db/schema";
import { Badge } from "@/components/ui/badge"
import { cn } from '@/lib/utils';
import Container from '@/components/Container';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { AVAILABLE_STATUSES } from '@/data/invoices';
import { updateStatusAction, deleteInvoiceAction } from '@/app/actions';

interface InvoiceProps {
  invoice: typeof Invoices.$inferInsert & {
    customer: typeof Customers.$inferInsert
  }
}

export default function Invoice({ invoice }: InvoiceProps) {
  const [currentStatus, setCurrentStatus] = useOptimistic(invoice.status, (state, newStatus) => {
    return String(newStatus)
  })

  async function handleOnUpdateStatus(formData: FormData) {

    const originalStatus = currentStatus;
    setCurrentStatus(formData.get('status'))
    console.log('Updated status:', currentStatus);
    try {
      await updateStatusAction(formData);
    } catch {
      setCurrentStatus(originalStatus);
    }

    // //Temporay solution for Badge visial update
    // const refreshPage = () => {
    //   window.location.reload();
    // };
    // refreshPage()
  };

  return (
    <main className="w-full h-full gap-6">
      <Container>
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
          <div className='flex gap-4'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={'outline'}>
                  Change Staus
                  <ChevronDown className='w-4 h-auto' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AVAILABLE_STATUSES.map(status => {
                  return (
                    <DropdownMenuItem key={status.id} asChild>
                      <form action={handleOnUpdateStatus}>
                        <button type='submit'>
                          <input type="hidden" name='id' value={invoice.id} />
                          <input type="hidden" name='status' value={status.id} />
                          {status.lable}
                        </button>
                      </form>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className='flex items-center gap-2' variant={'outline'}>
                    <span className='sr-only'>More Options</span>
                    <Ellipsis className='w-4 h-auto' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button className='flex gap-2'>
                        <Trash className='w-4 h-auto' />
                        Delete Invoice
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/invoices/${invoice.id}/payment`} className='flex gap-2'>
                      <CreditCard className='w-4 h-auto' />
                      Payment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DialogContent>
                <DialogHeader className='flex gap-3'>
                  <DialogTitle className='text-center'>Deleting Invoice?</DialogTitle>
                  <DialogDescription className='text-center'>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                  <DialogFooter>
                    <form action={deleteInvoiceAction}>
                      <input type="hidden" name='id' value={invoice.id} />
                      <Button variant='destructive' className='flex gap-2'>
                        <Trash className='w-4 h-auto' />
                        Delete Invoice
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogHeader>
              </DialogContent>
            </Dialog>


          </div>
        </div>
        <p className='text-3xl mb-3'>
          ${(invoice.value / 100).toFixed(2)}
        </p>
        <p className='text-lg mb-8'>
          {invoice.description}
        </p>
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
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">Billing Email</strong>
            <span>{invoice.customer.email}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
