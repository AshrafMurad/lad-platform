"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ProductsManagementPage,
  ProductForm,
  ProductDetails,
} from "@/features/products/components";
import { Product } from "@/features/products/types";
import { useProductsStore } from "@/features/products/store/productsStore";

type ViewMode = "list" | "create" | "edit" | "view";

export default function SupplierProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const {
    products,
    fetchProducts,
    getProduct,
    selectedProduct,
    setSelectedProduct,
    isLoading, // Add loading state
    error, // Add error state
  } = useProductsStore();

  // No need to fetch products here - ProductsManagementPage handles its own data fetching
  // useEffect removed to prevent duplicate API calls

  // Update view mode and load specific product based on URL params
  useEffect(() => {
    const mode = searchParams.get("mode");
    const productId = searchParams.get("id");

    if (mode === "new" || mode === "create") {
      setViewMode("create");
      setSelectedProduct(null);
    } else if (mode === "edit" && productId) {
      setViewMode("edit");
      // Load specific product by ID instead of searching through all products
      getProduct(Number(productId));
    } else if (mode === "view" && productId) {
      setViewMode("view");
      // Load specific product by ID for viewing
      getProduct(Number(productId));
    } else {
      setViewMode("list");
      setSelectedProduct(null);
    }
  }, [searchParams]); // Removed function dependencies

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    router.push("/dashboard/supplier/products?mode=new");
  };

  const handleEditProduct = (productId: number) => {
    router.push(`/dashboard/supplier/products?mode=edit&id=${productId}`);
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/dashboard/supplier/products?mode=view&id=${productId}`);
  };

  const handleFormSuccess = (product: Product) => {
    // Clear selected product and go back to list
    setSelectedProduct(null);
    router.push("/dashboard/supplier/products");
  };

  const handleFormCancel = () => {
    // Clear selected product and go back to list
    setSelectedProduct(null);
    router.push("/dashboard/supplier/products");
  };

  const renderContent = () => {
    switch (viewMode) {
      case "create":
      case "edit":
        return (
          <ProductForm
            product={selectedProduct || undefined}
            isLoadingProduct={isLoading && viewMode === "edit"} // Pass loading state for edit mode
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        );

      case "view":
        return (
          <ProductDetails
            product={selectedProduct || undefined}
            isLoading={isLoading}
            error={error}
            onEdit={() => {
              if (selectedProduct) {
                handleEditProduct(Number(selectedProduct.id));
              }
            }}
            onBack={() => router.push("/dashboard/supplier/products")}
            onRetry={() => {
              const productId = searchParams.get("id");
              if (productId) {
                getProduct(Number(productId));
              }
            }}
          />
        );

      default:
        return (
          <ProductsManagementPage
            onCreateProduct={handleCreateProduct}
            onEditProduct={handleEditProduct}
            onViewProduct={handleViewProduct}
          />
        );
    }
  };

  return <div className="min-h-screen bg-background">{renderContent()}</div>;
}
