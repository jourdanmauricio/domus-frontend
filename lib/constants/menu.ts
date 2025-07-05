import {
  Home,
  Users,
  Building2,
  FileText,
  Receipt,
  FileSignature,
  User,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const menuItems: Record<string, MenuItem[]> = {
  admin: [
    {
      title: "Home",
      href: "/dashboard/admin",
      icon: Home,
    },
    {
      title: "Usuarios",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      title: "Propiedades",
      href: "/dashboard/admin/properties",
      icon: Building2,
    },
    {
      title: "Contratos",
      href: "/dashboard/admin/contracts",
      icon: FileText,
    },
    {
      title: "Recibos",
      href: "/dashboard/admin/receipts",
      icon: Receipt,
    },
    {
      title: "Mi Perfil",
      href: "/dashboard/profile",
      icon: User,
    },
  ],
  user: [
    {
      title: "Home",
      href: "/dashboard/guarantor",
      icon: Home,
    },
    {
      title: "Mi Perfil",
      href: "/dashboard/profile",
      icon: User,
    },
    // {
    //   title: "Recibos",
    //   href: "/dashboard/receipts",
    //   icon: Receipt,
    // },
    // {
    //   title: "Contrato",
    //   href: "/dashboard/contract",
    //   icon: FileSignature,
    // },
  ],
  tenant: [
    {
      title: "Home",
      href: "/dashboard/tenant",
      icon: Home,
    },
    {
      title: "Mi Perfil",
      href: "/dashboard/profile",
      icon: User,
    },
    // {
    //   title: "Recibos",
    //   href: "/dashboard/receipts",
    //   icon: Receipt,
    // },
    // {
    //   title: "Contrato",
    //   href: "/dashboard/contract",
    //   icon: FileSignature,
    // },
  ],
  guarantor: [
    {
      title: "Home",
      href: "/dashboard/guarantor",
      icon: Home,
    },
    {
      title: "Mi Perfil",
      href: "/dashboard/profile",
      icon: User,
    },
    // {
    //   title: "Recibos",
    //   href: "/dashboard/receipts",
    //   icon: Receipt,
    // },
    // {
    //   title: "Contrato",
    //   href: "/dashboard/contract",
    //   icon: FileSignature,
    // },
  ],
};

// Menú común para todos los roles
export const commonMenuItems: MenuItem[] = [
  {
    title: "Mi Perfil",
    href: "/dashboard/profile",
    icon: User,
  },
];
