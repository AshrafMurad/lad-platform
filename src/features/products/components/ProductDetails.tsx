import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Eye,
  EyeOff,
  Share2,
  Heart,
  ShoppingCart,
  Download,
  FileText,
  ImageIcon,
  Star,
  MapPin,
  User,
  Calendar,
  Tag,
  DollarSign,
} from "lucide-react";
import { formatPrice } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/shared/components/ui/ErrorState";
import { cn } from "@/lib/utils";
import { useLocale } from "@/hooks/useLocale";
import { useTranslations } from "next-intl";
import { Product, ProductMedia } from "../types";
import { PRODUCT_LABELS } from "../constants";

interface ProductDetailsProps {
  product?: Product;
  isLoading?: boolean;
  error?: string | null; // Add error prop
  onEdit?: () => void;
  onBack?: () => void;
  onToggleVisibility?: () => void;
  onShare?: () => void;
  onDownload?: (media: ProductMedia) => void;
  onRetry?: () => void; // Add retry prop
}

export function ProductDetails({
  product,
  isLoading = false,
  error = null,
  onEdit,
  onBack,
  onToggleVisibility,
  onShare,
  onDownload,
  onRetry,
}: ProductDetailsProps) {
  const { currentLocale } = useLocale();
  const t = useTranslations("products");
  const isRTL = currentLocale === "ar";
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return <ProductDetailsSkeleton isRTL={isRTL} onBack={onBack} />;
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
            {t("back")}
          </Button>
        </div>
        <ErrorState
          title={t("errors.failedToLoad")}
          error={error}
          onRetry={onRetry}
          variant="card"
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-muted-foreground mb-2">
            {t("notFound.title")}
          </h2>
          <p className="text-muted-foreground mb-4">{t("notFound.message")}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
            {t("goBack")}
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images || product.product_images || [];
  const documents = product.documents || product.product_documents || [];
  const currentImage = images[selectedImageIndex];

  const getProductName = () => {
    if (isRTL) {
      return product.name_ar || product.name || "اسم المنتج";
    }
    return product.name_en || product.name || "Product Name";
  };

  const getProductDescription = () => {
    if (isRTL) {
      return product.description_ar || product.description || "وصف المنتج";
    }
    return (
      product.description_en || product.description || "Product Description"
    );
  };

  const getCategoryName = (category: any) => {
    if (!category) return "";
    if (isRTL) {
      return category.name_ar || category.name || "";
    }
    return category.name_en || category.name || "";
  };

  const getDiscountedPrice = () => {
    if (!product.discount_value || product.discount_type === "none") {
      return null;
    }

    const price =
      typeof product.price === "string"
        ? parseFloat(product.price)
        : product.price;
    const discountValue =
      typeof product.discount_value === "string"
        ? parseFloat(product.discount_value)
        : product.discount_value;

    let discountedPrice = price;
    if (product.discount_type === "percent") {
      discountedPrice = price - (price * discountValue) / 100;
    } else if (product.discount_type === "fixed") {
      discountedPrice = price - discountValue;
    }

    return Math.max(0, discountedPrice);
  };

  const discountedPrice = getDiscountedPrice();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          {isRTL ? "العودة" : "Back"}
        </Button>

        <div className="flex items-center gap-2">
          {onToggleVisibility && (
            <Button
              onClick={onToggleVisibility}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {product.is_active ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  {t("hide")}
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  {t("show")}
                </>
              )}
            </Button>
          )}

          {onShare && (
            <Button
              onClick={onShare}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              {t("share")}
            </Button>
          )}

          {onEdit && (
            <Button
              onClick={onEdit}
              size="sm"
              className="bg-design-main hover:bg-design-main-dark flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {t("edit")}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          {/* Main Image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {currentImage ? (
                <div className="relative aspect-square bg-gray-50 dark:bg-gray-900">
                  <img
                    src={currentImage.url || currentImage.original_url}
                    alt={getProductName()}
                    className="w-full h-full object-cover"
                  />
                  {images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between p-4">
                      <Button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        variant="secondary"
                        size="sm"
                        className="bg-black/20 hover:bg-black/40 text-white border-0"
                      >
                        <ArrowLeft
                          className={cn("w-4 h-4", isRTL && "rotate-180")}
                        />
                      </Button>
                      <Button
                        onClick={() =>
                          setSelectedImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        variant="secondary"
                        size="sm"
                        className="bg-black/20 hover:bg-black/40 text-white border-0"
                      >
                        <ArrowRight
                          className={cn("w-4 h-4", isRTL && "rotate-180")}
                        />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                    selectedImageIndex === index
                      ? "border-design-main"
                      : "border-transparent hover:border-gray-300"
                  )}
                >
                  <img
                    src={image.url || image.original_url}
                    alt={`${getProductName()} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{getProductName()}</h1>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.main_category && (
                    <Badge variant="secondary">
                      {getCategoryName(product.main_category)}
                    </Badge>
                  )}
                  {product.sub_category && (
                    <Badge variant="outline">
                      {getCategoryName(product.sub_category)}
                    </Badge>
                  )}
                  {product.micro_category && (
                    <Badge variant="outline" className="bg-muted">
                      {getCategoryName(product.micro_category)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status & Label */}
              <div className="text-right space-y-2">
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active
                    ? isRTL
                      ? "نشط"
                      : "Active"
                    : isRTL
                    ? "غير نشط"
                    : "Inactive"}
                </Badge>
                {product.label && product.label !== "none" && (
                  <Badge
                    variant="outline"
                    className={cn(
                      product.label === "best_seller" && "bg-s-5 text-white",
                      product.label === "special_offer" && "bg-d-5 text-white"
                    )}
                  >
                    {PRODUCT_LABELS[
                      product.label as keyof typeof PRODUCT_LABELS
                    ]?.[currentLocale] || product.label}
                  </Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-design-main" />
                <span className="text-3xl font-bold text-design-main">
                  {formatPrice(
                    product.price_after_discount
                      ? typeof product.price_after_discount === "string"
                        ? parseFloat(product.price_after_discount)
                        : product.price_after_discount
                      : typeof product.price === "string"
                      ? parseFloat(product.price)
                      : product.price,
                    isRTL
                  )}
                </span>
                {product.price_after_discount &&
                  product.price_after_discount !== product.price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(
                        typeof product.price === "string"
                          ? parseFloat(product.price)
                          : product.price,
                        isRTL
                      )}
                    </span>
                  )}
              </div>

              {product.discount_value && product.discount_type !== "none" && (
                <Badge variant="destructive">
                  {product.discount_type === "percent"
                    ? `${product.discount_value}% ${t("off")}`
                    : `${formatPrice(
                        typeof product.discount_value === "string"
                          ? parseFloat(product.discount_value)
                          : product.discount_value,
                        isRTL
                      )} ${t("discount")}`}
                </Badge>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{t("description")}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {getProductDescription()}
              </p>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("productDetails")}</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("id")}</span>
                <span className="font-medium">#{product.id}</span>
              </div>

              {product.display_order && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("order")}</span>
                  <span className="font-medium">{product.display_order}</span>
                </div>
              )}

              {product.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{t("created")}</span>
                  <span className="font-medium">
                    {new Date(product.created_at).toLocaleDateString(
                      isRTL ? "ar-SA" : "en-US"
                    )}
                  </span>
                </div>
              )}

              {product.updated_at &&
                product.updated_at !== product.created_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {isRTL ? "آخر تحديث:" : "Updated:"}
                    </span>
                    <span className="font-medium">
                      {new Date(product.updated_at).toLocaleDateString(
                        isRTL ? "ar-SA" : "en-US"
                      )}
                    </span>
                  </div>
                )}
            </div>
          </div>

          {/* Documents */}
          {documents.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {isRTL ? "المستندات" : "Documents"}
                </h3>

                <div className="space-y-2">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">
                          {document.filename ||
                            document.file_name ||
                            document.name ||
                            `Document ${document.id}`}
                        </span>
                      </div>

                      {onDownload && (
                        <Button
                          onClick={() => onDownload(document)}
                          variant="ghost"
                          size="sm"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Pricing Rules */}
          {product.pricing_rules && product.pricing_rules.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {isRTL ? "قواعد التسعير" : "Pricing Rules"}
                </h3>
                <div className="space-y-2">
                  {product.pricing_rules.map((rule: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="text-sm">
                        {isRTL ? "قاعدة تسعير" : "Pricing Rule"} #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Project Usages */}
          {product.project_usages && product.project_usages.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {isRTL ? "استخدامات المشروع" : "Project Usages"}
                </h3>
                <div className="space-y-2">
                  {product.project_usages.map((usage: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-muted/30"
                    >
                      <div className="text-sm">
                        {isRTL ? "استخدام" : "Usage"} #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton component for loading state
function ProductDetailsSkeleton({
  isRTL,
  onBack,
}: {
  isRTL: boolean;
  onBack?: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          {isRTL ? "العودة" : "Back"}
        </Button>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images Section */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full" />
            </CardContent>
          </Card>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-full" />
            ))}
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>

            <div>
              <Skeleton className="h-6 w-20 mb-3" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
