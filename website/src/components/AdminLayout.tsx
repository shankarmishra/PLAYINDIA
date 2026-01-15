import React, { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // AdminLayout is a minimal wrapper that excludes user Layout
  // Individual admin pages handle their own styling and Head tags
  return <>{children}</>;
};

export default AdminLayout;
