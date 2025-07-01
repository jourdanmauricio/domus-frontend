import {
  Home,
  Users,
  Building2,
  FileText,
  Receipt,
  FileSignature,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const adminMenuItems: MenuItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Usuarios",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Propiedades",
    href: "/dashboard/properties",
    icon: Building2,
  },
  {
    title: "Contratos",
    href: "/dashboard/contracts",
    icon: FileText,
  },
];

export const tenantGuarantorMenuItems: MenuItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Recibos",
    href: "/dashboard/receipts",
    icon: Receipt,
  },
  {
    title: "Contrato",
    href: "/dashboard/contract",
    icon: FileSignature,
  },
];
