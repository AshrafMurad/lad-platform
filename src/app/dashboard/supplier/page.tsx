import { Package, Plus, Eye } from "lucide-react";
import Link from "next/link";
import ProfileCompletionAlert from "@/features/profile/components/ProfileCompletionAlert";

export default function SupplierPage() {
  return (
    <div className="w-full h-full p-6">
      <div className="flex flex-col gap-8">
        {/* Profile Completion Alert */}
        <ProfileCompletionAlert />

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Supplier Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Welcome to your supplier dashboard. Manage your products and
            business operations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/supplier/products">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-design-main/10 rounded-lg">
                  <Package className="w-6 h-6 text-design-main" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    إدارة المنتجات
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Product Management
                  </p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Add, edit, and manage your product catalog
              </div>
            </div>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 opacity-60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Eye className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  الطلبات
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Orders Management
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Coming soon...
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 opacity-60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  التقارير
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reports & Analytics
                </p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Coming soon...
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Getting Started
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-s-5 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Complete your profile information
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-design-main rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Add your first product to the catalog
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-400">
                Start receiving orders from customers
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
