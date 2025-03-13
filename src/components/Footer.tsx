import Container from './Container';

const Header = () => {
  return (
    <header className='mt-6 mb-8'>
      <Container className='flex justify-between gap-4'>
        <p className='text-sm'>
          MyInvoice &copy; {new Date().getFullYear()}
        </p>

        <p className='text-sm'>
          Created by  mahady Hasan.
        </p>
      </Container>
    </header>
  )
}


export default Header;