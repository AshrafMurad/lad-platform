import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import {
  ProductGridSkeleton,
  ProductTableSkeleton,
} from "@/shared/components/ui/ProductSkeleton";
import {
  FadeIn,
  SlideUp,
  StaggerContainer,
} from "@/shared/components/animations";

import { ProductCard } from "./ProductCard";
import { useProductsStore } from "../store/productsStore";
import { formatPrice } from "@/lib/helpers";
import { useLocale } from "@/hooks/useLocale";
import toast from "react-hot-toast";
import { PAGINATION_DEFAULTS } from "@/constants/global";
import { PRODUCT_LABELS } from "../constants";

type ViewMode = "grid" | "table";

interface ProductsManagementPageProps {
  onCreateProduct?: () => void;
  onEditProduct?: (productId: number) => void;
  onViewProduct?: (productId: number) => void;
}

export function ProductsManagementPage({
  onCreateProduct,
  onEditProduct,
  onViewProduct,
}: ProductsManagementPageProps) {
  const t = useTranslations("products");
  const { currentLocale } = useLocale();
  const isRTL = currentLocale === "ar";

  // Local UI state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLabel, setSelectedLabel] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deletingProductId, setDeletingProductId] = useState<number | null>(
    null
  );

  // Store state
  const {
    products,
    isLoading,
    error,
    totalProducts,
    currentPage,
    totalPages,
    filters,
    fetchProducts,
    setFilters,
    clearFilters,
    setPage,
    clearError,
    deleteProduct,
  } = useProductsStore();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []); // Only run once on mount

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchQuery });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]); // Removed setFilters dependency

  // Handle filter changes
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setFilters({
      category_id: value && value !== "all" ? parseInt(value) : undefined,
      page: 1,
    });
  };

  const handleLabelChange = (value: string) => {
    setSelectedLabel(value);
    setFilters({
      label: (value && value !== "all" ? value : undefined) as any,
      page: 1,
    });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setFilters({
      is_active:
        value === "active" ? true : value === "inactive" ? false : undefined,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLabel("all");
    setStatusFilter("all");
    clearFilters();
  };

  const handleRetry = () => {
    clearError();
    fetchProducts();
  };

  const handleCreateProduct = () => {
    onCreateProduct?.();
  };

  const handleEditProduct = (productId: number) => {
    onEditProduct?.(productId);
  };

  const handleViewProduct = (productId: number) => {
    onViewProduct?.(productId);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (deletingProductId) return; // Prevent multiple simultaneous deletions

    const confirmed = window.confirm(
      isRTL
        ? "هل أنت متأكد من حذف هذا المنتج؟"
        : "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setDeletingProductId(productId);

    try {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success(
          isRTL ? "تم حذف المنتج بنجاح" : "Product deleted successfully"
        );
      } else {
        toast.error(isRTL ? "فشل في حذف المنتج" : "Failed to delete product");
      }
    } catch (error) {
      toast.error(
        isRTL ? "حدث خطأ أثناء حذف المنتج" : "Error deleting product"
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === currentPage ? "primary" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="min-w-[40px]"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          {isRTL ? "السابق" : "Previous"}
        </Button>

        {pages}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {isRTL ? "التالي" : "Next"}
        </Button>
      </div>
    );
  };

  // Early return removed - error will be handled in the products area only

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isRTL ? "إدارة المنتجات" : "Products Management"}
            </h1>
            <p className="text-muted-foreground">
              {isRTL
                ? `إجمالي المنتجات: ${totalProducts}`
                : `Total Products: ${totalProducts}`}
            </p>
          </div>

          <Button
            onClick={handleCreateProduct}
            className="bg-design-main hover:bg-design-main-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            {isRTL ? "إضافة منتج" : "Add Product"}
          </Button>
        </div>
      </FadeIn>

      {/* Filters and Controls */}
      <SlideUp delay={0.1}>
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              {isRTL ? "البحث والتصفية" : "Search & Filters"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={
                  isRTL ? "البحث في المنتجات..." : "Search products..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={isRTL ? "جميع الفئات" : "All Categories"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isRTL ? "جميع الفئات" : "All Categories"}
                  </SelectItem>
                  {/* TODO: Add actual categories from API */}
                  <SelectItem value="1">
                    {isRTL ? "مواد البناء" : "Building Materials"}
                  </SelectItem>
                  <SelectItem value="2">{isRTL ? "أدوات" : "Tools"}</SelectItem>
                </SelectContent>
              </Select>

              {/* Label Filter */}
              <Select value={selectedLabel} onValueChange={handleLabelChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={isRTL ? "جميع التصنيفات" : "All Labels"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isRTL ? "جميع التصنيفات" : "All Labels"}
                  </SelectItem>
                  {Object.entries(PRODUCT_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {isRTL ? label.ar : label.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={isRTL ? "جميع الحالات" : "All Status"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {isRTL ? "جميع الحالات" : "All Status"}
                  </SelectItem>
                  <SelectItem value="active">
                    {isRTL ? "نشط" : "Active"}
                  </SelectItem>
                  <SelectItem value="inactive">
                    {isRTL ? "غير نشط" : "Inactive"}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                {isRTL ? "مسح الفلاتر" : "Clear Filters"}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Results Summary */}
              <div className="text-sm text-muted-foreground">
                {isRTL
                  ? `عرض ${products.length} من ${totalProducts} منتج`
                  : `Showing ${products.length} of ${totalProducts} products`}
              </div>
            </div>
          </CardContent>
        </Card>
      </SlideUp>

      {/* Products Content */}
      <SlideUp delay={0.2}>
        {isLoading ? (
          <div className="mt-6">
            {viewMode === "grid" ? (
              <ProductGridSkeleton count={12} />
            ) : (
              <ProductTableSkeleton rows={8} />
            )}
          </div>
        ) : error ? (
          <ErrorState
            title={isRTL ? "فشل في تحميل المنتجات" : "Failed to load products"}
            error={error}
            onRetry={handleRetry}
          />
        ) : products.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? "لا توجد منتجات" : "No Products Found"}
                </h3>
                <p>
                  {isRTL
                    ? "لم يتم العثور على منتجات تطابق معايير البحث الخاصة بك"
                    : "No products match your search criteria"}
                </p>
                <Button className="mt-4" onClick={handleCreateProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isRTL ? "إضافة أول منتج" : "Add First Product"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <StaggerContainer>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onView={() => handleViewProduct(Number(product.id))}
                    onEdit={() => handleEditProduct(Number(product.id))}
                    onDelete={() => handleDeleteProduct(Number(product.id))}
                    isDeleting={deletingProductId === Number(product.id)}
                    className="animate-fade-in"
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  {/* Table view implementation */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold`}
                          >
                            {isRTL ? "المنتج" : "Product"}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold`}
                          >
                            {isRTL ? "الفئة" : "Category"}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold`}
                          >
                            {isRTL ? "السعر" : "Price"}
                          </th>
                          <th
                            className={`${
                              isRTL ? "text-right" : "text-left"
                            } p-4 font-semibold`}
                          >
                            {isRTL ? "الحالة" : "Status"}
                          </th>
                          <th className="text-center p-4 font-semibold">
                            {isRTL ? "الإجراءات" : "Actions"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-border/50 hover:bg-muted/30"
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
                                  {(product.product_images ||
                                    product.images)?.[0] ? (
                                    <img
                                      src={
                                        (product.product_images ||
                                          product.images)![0].original_url ||
                                        (product.product_images ||
                                          product.images)![0].url
                                      }
                                      alt={
                                        product.name || `Product #${product.id}`
                                      }
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200" />
                                  )}
                                </div>
                                <div>
                                  <div
                                    className="font-medium cursor-pointer hover:text-design-main transition-colors"
                                    onClick={() =>
                                      handleViewProduct(Number(product.id))
                                    }
                                    title={
                                      isRTL
                                        ? "اضغط لعرض تفاصيل المنتج"
                                        : "Click to view product details"
                                    }
                                  >
                                    {product.name ||
                                      (isRTL
                                        ? product.name_ar
                                        : product.name_en) ||
                                      `Product #${product.id}` ||
                                      "Unnamed Product"}
                                  </div>
                                  <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                    {product.description ||
                                      (isRTL
                                        ? product.description_ar
                                        : product.description_en)}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              {(product.main_category || product.category) && (
                                <Badge variant="outline">
                                  {isRTL
                                    ? product.main_category?.name ||
                                      product.category?.name_ar ||
                                      product.category?.name
                                    : product.main_category?.name ||
                                      product.category?.name_en ||
                                      product.category?.name}
                                </Badge>
                              )}
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-design-main">
                                {formatPrice(
                                  product.price_after_discount
                                    ? typeof product.price_after_discount ===
                                      "string"
                                      ? parseFloat(product.price_after_discount)
                                      : product.price_after_discount
                                    : product.final_price ||
                                        (typeof product.price === "string"
                                          ? parseFloat(product.price)
                                          : product.price),
                                  isRTL
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge
                                variant={
                                  product.is_active ? "default" : "secondary"
                                }
                              >
                                {product.is_active
                                  ? isRTL
                                    ? "نشط"
                                    : "Active"
                                  : isRTL
                                  ? "غير نشط"
                                  : "Inactive"}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={
                                      deletingProductId === Number(product.id)
                                    }
                                  >
                                    {deletingProductId ===
                                    Number(product.id) ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                    ) : (
                                      <MoreHorizontal className="w-4 h-4" />
                                    )}
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align={isRTL ? "start" : "end"}
                                  className="w-40"
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleViewProduct(Number(product.id))
                                    }
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    {isRTL ? "عرض" : "View"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleEditProduct(Number(product.id))
                                    }
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    {isRTL ? "تعديل" : "Edit"}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteProduct(Number(product.id))
                                    }
                                    disabled={
                                      deletingProductId === Number(product.id)
                                    }
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    {deletingProductId === Number(product.id)
                                      ? isRTL
                                        ? "جارِ الحذف..."
                                        : "Deleting..."
                                      : isRTL
                                      ? "حذف"
                                      : "Delete"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </StaggerContainer>
        )}
      </SlideUp>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}
