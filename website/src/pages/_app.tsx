import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/AdminLayout";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminPage = router.pathname.startsWith('/admin');
  const isStorePage = router.pathname.startsWith('/store');
  const isCoachPage = router.pathname.startsWith('/coach');
  const isDeliveryPage = router.pathname.startsWith('/delivery');

  // Pages that don't need Layout wrapper (they have their own navigation)
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

  // Store, Coach, and Delivery pages have their own navigation - don't wrap with Layout
  if (isStorePage || isCoachPage || isDeliveryPage) {
    return <Component {...pageProps} />;
  }

  // All other pages use the default Layout with user navigation
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
