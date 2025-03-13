

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center h-screen text-center gap-6 max-w-5xl mx-auto">
      <h1 className="block text-5xl mb-4 font-bold bg-gradient-to-l from-blue-500 via-teal-500 to-green-500 text-transparent bg-clip-text leading-[2]">My Invoice App</h1>
      <p className="flex justify-between gap-4">
        <Button asChild>
          <Link href="/dashboard">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </p>

    </main>
  );
}
