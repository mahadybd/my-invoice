'use client'

import { useState, type SyntheticEvent } from 'react';
import Form from 'next/form';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SubmitButton from '@/components/SubmitButton';


import { createAction } from '@/app/actions';
import Container from '@/components/Container';

export default function Home() {
  const [state, setState] = useState("ready");

  async function handleOnSubmit(event: SyntheticEvent) {
    if (state === "pending") {
      event.preventDefault();
      return;
    }
    setState("pending");
  }

  return (
    <main className="h-full">
      <Container>
        <div>
          <div className="flex justify-between mb-6">
            <h1 className="text-3xl font-semibolds">
              Create Invoice
            </h1>
          </div>

          <Form action={createAction} onSubmit={handleOnSubmit} className="grid gap-4 max-w-xs">
            <div>
              <Label htmlFor="name" className="block font-semibold text-sm mb-2">Billing Name</Label>
              <Input id="name" name="name" type="text" />
            </div>
            <div>
              <Label htmlFor="email" className="block font-semibold text-sm mb-2">Billing Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div>
              <Label htmlFor="value" className="block font-semibold text-sm mb-2">Value</Label>
              <Input id="value" name="value" type="text" />
            </div>
            <div>
              <Label htmlFor="description" className="block font-semibold text-sm mb-2">Description</Label>
              <Textarea name="description" id="description"></Textarea>
            </div>
            <div>
              <SubmitButton />
            </div>
          </Form>
        </div>
      </Container>
    </main>
  );
}
