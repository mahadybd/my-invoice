import { NextApiRequest, NextApiResponse } from 'next';
import { revalidatePath } from 'next/cache';

const revalidateRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  const invoiceId = req.query.invoiceId;
  await revalidatePath(`/invoices/${invoiceId}`);
  res.status(200).json({ message: 'Revalidation successful' });
};

export default revalidateRoute;