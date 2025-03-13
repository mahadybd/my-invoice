import { SignIn } from '@clerk/nextjs'
import Container from '@/components/Container';

export default function Page() {
  return (
    <Container>
      <SignIn />
    </Container>
  )
}