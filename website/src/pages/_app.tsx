import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');

  if (isAdminPage) {
    // Admin login page doesn't need AdminLayout wrapper (it has its own full-page layout)
    if (router.pathname === '/admin/login') {
      return <Component {...pageProps} />;
    }
    
    return (
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
