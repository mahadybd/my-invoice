# Invoice App (Full-Stack)

## Overview

The **Invoice App** is a full-stack web application designed for seamless invoice management. It enables users to generate, track, and process invoices efficiently while integrating authentication, payment processing, and email notifications. Built with modern technologies, this app ensures a smooth and scalable experience for individuals and businesses.

## Tech Stack

This project leverages the following technologies:

- **Frontend:** [Next.js 15](https://nextjs.org/) + [React 19 RC](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [ShadCN](https://ui.shadcn.com/)
- **Database & ORM:** [Xata](https://xata.io/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication & Authorization:** [Clerk](https://clerk.dev/) (Social login, organization support, passkey authentication)
- **Payments:** [Stripe](https://stripe.com/) for secure transaction processing
- **Email Notifications:** [React Email](https://react.email/) + [Resend](https://resend.com/) for invoice emails
- **Deployment:** [Vercel](https://vercel.com/) for global hosting

## Features

- **User Authentication & Role Management** (via Clerk)
- **Invoice Creation, Management, and Tracking**
- **Secure Payment Processing with Stripe**
- **Automated Email Notifications** for invoice updates
- **Responsive & Accessible UI** powered by Tailwind CSS and ShadCN
- **Optimized Performance & Scalability** with Next.js 15 and Xata

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (LTS version recommended)
- **npm** or **yarn** (for package management)

### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/invoice-app.git
   cd invoice-app
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add the necessary environment variables (e.g., API keys for Clerk, Stripe, Xata, Resend).

4. **Run the development server:**

   ```sh
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## Usage

### Creating & Managing Invoices

1. Navigate to the **Create Invoice** page.
2. Fill out the required fields, including client details, invoice items, and due date.
3. Submit the invoice to generate a unique invoice ID.
4. View, update, or delete invoices from the **Invoices** page.

### Payments

- Customers can securely pay invoices using Stripe.
- Payment status is automatically updated in the system.

### Email Notifications

- Clients receive an email notification when a new invoice is created.
- Payment reminders and status updates are sent via **React Email** + **Resend**.

---

## Contributing

Contributions are welcome! Follow these steps to contribute:

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature/your-feature`)
3. **Implement your changes** and **commit them** (`git commit -m "Add feature XYZ"`)
4. **Push to your branch** (`git push origin feature/your-feature`)
5. **Open a pull request**

Please ensure your code follows best practices and includes necessary documentation.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.
