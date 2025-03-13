import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { OrganizationSwitcher } from '@clerk/nextjs'

import Container from './Container';
import Link from 'next/link';

const Header = () => {
  return (
    <header className='mt-4 mb-12'>
      <Container>
        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <p className='text-2xl font-bold'>
              <Link href="/dashboard">MyInvoice</Link>
            </p>
            <span className='text-slate-300 font-semibold'>/</span>
            <SignedIn>
              <span className='-ml-2'>
                <OrganizationSwitcher
                  afterCreateOrganizationUrl="/dashboard"
                />
              </span>
            </SignedIn>
          </div>

          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  )
}


export default Header;