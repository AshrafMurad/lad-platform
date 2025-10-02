import { useState } from "react";
import { Eye, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Badge } from "@/shared/components/ui/badge";
import { FadeIn } from "@/shared/components/animations";
import { useProductsStore } from "../store/productsStore";
import { Product, ProductLabel } from "../types";
import { useLocale } from "@/hooks/useLocale";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/helpers";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  isDeleting?: boolean; // Allow parent to control deletion loading state
  className?: string;
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  isDeleting: externalIsDeleting = false,
  className,
}: ProductCardProps) {
  const { currentLocale } = useLocale();
  const t = useTranslations("products");
  const [internalIsDeleting, setInternalIsDeleting] = useState(false);
  const { deleteProduct } = useProductsStore();

  const isRTL = currentLocale === "ar";

  // Use external loading state if provided, otherwise use internal
  const isDeleting = externalIsDeleting || internalIsDeleting;

  // Use single name field from API or fallback to locale-specific names
  const productName =
    product.name || (isRTL ? product.name_ar : product.name_en);
  const displayName =
    productName || `Product #${product.id}` || "Unnamed Product";
  // Use single description field from API or fallback to locale-specific descriptions
  const productDescription =
    product.description ||
    (isRTL ? product.description_ar : product.description_en);

  const handleView = () => {
    onView?.(product);
  };

  const handleEdit = () => {
    onEdit?.(product);
  };

  const handleDelete = async () => {
    if (isDeleting) return;

    // If parent provides onDelete handler, use it (parent handles confirmation and API call)
    if (onDelete) {
      onDelete(Number(product.id));
      return;
    }

    // Otherwise, handle deletion internally with confirmation
    const confirmed = window.confirm(
      isRTL
        ? "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        : "Are you sure you want to delete this product? This action cannot be undone."
    );

    if (!confirmed) return;

    setInternalIsDeleting(true);

    try {
      const success = await deleteProduct(Number(product.id));

      if (success) {
        toast.success(t("success.deleteSuccess"));
      } else {
        toast.error(t("errors.deleteFailed"));
      }
    } catch (error) {
      toast.error(t("errors.deleteError"));
    } finally {
      setInternalIsDeleting(false);
    }
  };

  const getLabelVariant = (label: ProductLabel) => {
    switch (label) {
      case "best_seller":
        return "bg-s-5 text-white"; // Success green
      case "special_offer":
        return "bg-w-5 text-black"; // Warning yellow
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getLabelText = (label: ProductLabel) => {
    switch (label) {
      case "best_seller":
        return t("bestSeller");
      case "special_offer":
        return t("specialOffer");
      default:
        return "";
    }
  };

  // Price calculations - handle API structure
  const originalPrice =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;
  const discountValue = product.discount_value
    ? typeof product.discount_value === "string"
      ? parseFloat(product.discount_value)
      : product.discount_value
    : 0;
  const hasDiscount = product.discount_type !== "none" && discountValue > 0;
  const finalPrice = product.price_after_discount
    ? typeof product.price_after_discount === "string"
      ? parseFloat(product.price_after_discount)
      : product.price_after_discount
    : product.final_price || originalPrice;

  return (
    <FadeIn delay={0.1}>
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        <Card className="h-auto max-h-[320px] group overflow-hidden hover:shadow-lg transition-all duration-300 p-0">
          <div className="h-full flex flex-col">
            {/* Image and Actions */}
            <div className="relative flex-shrink-0">
              {/* Product Image */}
              <div className="w-full h-40 bg-muted/20 dark:bg-muted/10 overflow-hidden rounded-t-lg">
                {(product.product_images || product.images) &&
                (product.product_images || product.images)!.length > 0 ? (
                  <img
                    src={
                      (product.product_images || product.images)![0]
                        .original_url ||
                      (product.product_images || product.images)![0].url
                    }
                    alt={displayName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/30 dark:bg-muted/20">
                    <span className="text-muted-foreground text-sm">
                      {t("noImage")}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge
                  variant={product.is_active ? "default" : "secondary"}
                  className={
                    product.is_active
                      ? "bg-s-5 text-white"
                      : "bg-gray-500 text-white"
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
              </div>

              {/* Product Label */}
              {product.label !== "none" && (
                <div className="absolute top-2 left-2 mt-8">
                  <Badge className={getLabelVariant(product.label)}>
                    {getLabelText(product.label)}
                  </Badge>
                </div>
              )}

              {/* Action Buttons - 3-dots + eye icon layout */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {/* View Button - Eye Icon */}
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-8 h-8 p-0 bg-background/90 hover:bg-background shadow-sm"
                  onClick={handleView}
                  title={t("view")}
                >
                  <Eye className="w-4 h-4" />
                </Button>

                {/* More Actions - 3-dots Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-8 h-8 p-0 bg-background/90 hover:bg-background shadow-sm"
                      title={t("more")}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="w-4 h-4 mr-2" />
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-d-5 focus:text-d-5"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isDeleting
                        ? isRTL
                          ? "جارِ الحذف..."
                          : "Deleting..."
                        : isRTL
                        ? "حذف"
                        : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Loading Overlay for Optimistic Updates and Deletion */}
              {(product.is_optimistic || isDeleting) && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-design-main border-t-transparent rounded-full animate-spin" />
                    {isDeleting && (
                      <span className="text-sm text-muted-foreground">
                        {t("deleting")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-3 flex-1 flex flex-col justify-between">
              {/* Product Name and Description */}
              <div className="space-y-1">
                <h3
                  className="font-semibold text-foreground line-clamp-1 group-hover:text-design-main transition-colors text-sm"
                  title={displayName}
                >
                  {displayName}
                </h3>

                <p
                  className="text-xs text-muted-foreground line-clamp-2"
                  title={productDescription}
                >
                  {productDescription || t("noDescription")}
                </p>
              </div>

              {/* Price and Category - Fixed at bottom */}
              <div className="flex items-end justify-between mt-2 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-design-main">
                      {formatPrice(finalPrice, isRTL)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(originalPrice, isRTL)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && (
                    <Badge
                      variant="destructive"
                      className="text-xs bg-d-5 h-4 px-1"
                    >
                      {product.discount_type === "percent"
                        ? `${discountValue}%`
                        : `${formatPrice(discountValue, isRTL)} ${t("off")}`}
                    </Badge>
                  )}
                </div>

                {/* Category Badge */}
                {(product.main_category || product.category) && (
                  <Badge
                    variant="outline"
                    className="text-xs flex-shrink-0 h-4 px-1"
                  >
                    {isRTL
                      ? product.main_category?.name ||
                        product.category?.name_ar ||
                        product.category?.name
                      : product.main_category?.name ||
                        product.category?.name_en ||
                        product.category?.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </FadeIn>
  );
}
