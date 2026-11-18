import Layout from '@/components/layout/Layout';
import AuthCard from '@/components/auth/AuthCard';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <AuthCard />
      {children}
    </Layout>
  );
}
