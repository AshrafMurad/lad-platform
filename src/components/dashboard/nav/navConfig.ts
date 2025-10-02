import {
  Home,
  User,
  Bell,
  FileText,
  Briefcase,
  Package,
  Settings,
  HelpCircle,
  Search,
  FolderOpen,
  HandCoins,
  FileCheck,
  CreditCard,
  Package2,
  MessageSquare,
  Star,
  Building2,
  Users,
  ClipboardList,
} from "lucide-react";

export const roleNav = {
  individual: [
    { title: "navigation.dashboard", url: "/dashboard/individual", icon: Home },
    {
      title: "navigation.projects",
      url: "/dashboard/individual/projects",
      icon: FolderOpen,
    },
    {
      title: "navigation.offers",
      url: "/dashboard/individual/offers",
      icon: HandCoins,
    },
    {
      title: "navigation.contracts",
      url: "/dashboard/individual/contracts",
      icon: FileCheck,
    },
    {
      title: "navigation.payments",
      url: "/dashboard/individual/payments",
      icon: CreditCard,
    },
    {
      title: "navigation.materials",
      url: "/dashboard/individual/materials",
      icon: Package2,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/individual/messages",
      icon: MessageSquare,
    },
    {
      title: "navigation.reviews",
      url: "/dashboard/individual/reviews",
      icon: Star,
    },
  ],
  contractor: [
    {
      title: "navigation.dashboard",
      url: "/dashboard/contractor",
      icon: Home,
    },
    {
      title: "navigation.myOffers",
      url: "/dashboard/contractor/offers",
      icon: HandCoins,
    },
    {
      title: "navigation.browseProjects",
      url: "/dashboard/contractor/browse-projects",
      icon: FolderOpen,
    },
    {
      title: "navigation.contracts",
      url: "/dashboard/contractor/contracts",
      icon: FileCheck,
    },
    {
      title: "navigation.payments",
      url: "/dashboard/contractor/payments",
      icon: CreditCard,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/contractor/messages",
      icon: MessageSquare,
    },
  ],
  supplier: [
    { title: "navigation.dashboard", url: "/dashboard/supplier", icon: Home },
    {
      title: "navigation.offers",
      url: "/dashboard/supplier/offers",
      icon: HandCoins,
    },
    {
      title: "navigation.browseProjects",
      url: "/dashboard/supplier/browse-projects",
      icon: FolderOpen,
    },
    {
      title: "navigation.manageProducts",
      url: "/dashboard/supplier/products",
      icon: Package,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/supplier/messages",
      icon: MessageSquare,
    },
  ],
  organization: [
    {
      title: "navigation.dashboard",
      url: "/dashboard/organization",
      icon: Home,
    },
    {
      title: "navigation.projects",
      url: "/dashboard/organization/projects",
      icon: FolderOpen,
    },
    {
      title: "navigation.offers",
      url: "/dashboard/organization/offers",
      icon: HandCoins,
    },
    {
      title: "navigation.contracts",
      url: "/dashboard/organization/contracts",
      icon: FileCheck,
    },
    {
      title: "navigation.payments",
      url: "/dashboard/organization/payments",
      icon: CreditCard,
    },
    {
      title: "navigation.materials",
      url: "/dashboard/organization/materials",
      icon: Package2,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/organization/messages",
      icon: MessageSquare,
    },
    {
      title: "navigation.reviews",
      url: "/dashboard/organization/reviews",
      icon: Star,
    },
  ],
  engineering_office: [
    {
      title: "navigation.dashboard",
      url: "/dashboard/engineering_office",
      icon: Home,
    },
    {
      title: "navigation.offers",
      url: "/dashboard/engineering_office/profile",
      icon: HandCoins,
    },
    {
      title: "navigation.browseProjects",
      url: "/dashboard/engineering_office/projects",
      icon: FolderOpen,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/engineering_office/messages",
      icon: FileText,
    },
  ],
  freelance_engineer: [
    {
      title: "navigation.dashboard",
      url: "/dashboard/freelance_engineer",
      icon: Home,
    },
    {
      title: "navigation.offers",
      url: "/dashboard/freelance_engineer/profile",
      icon: HandCoins,
    },
    {
      title: "navigation.browseProjects",
      url: "/dashboard/freelance_engineer/projects",
      icon: FolderOpen,
    },
    {
      title: "navigation.messages",
      url: "/dashboard/freelance_engineer/messages",
      icon: FileText,
    },
  ],
};

export const secondaryNav = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
  {
    title: "Get Help",
    url: "#",
    icon: HelpCircle,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
];
