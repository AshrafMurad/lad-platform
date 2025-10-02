import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import { useProductsStore } from "../store/productsStore";
import { useLocale } from "@/hooks/useLocale";
import {
  productFormSchema,
  ProductFormValues,
  validateImageFile,
  validateDocumentFile,
} from "../utils/validation";
import { PRODUCT_LABELS } from "../constants";
import { Product, ProductFormData, ProductMedia } from "../types";

interface ProductFormProps {
  product?: Product;
  isLoadingProduct?: boolean; // Add explicit loading prop for when product is being fetched
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
}

export function ProductForm({
  product,
  isLoadingProduct = false,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { currentLocale } = useLocale();
  const isRTL = currentLocale === "ar";
  const isEditing = !!product;

  const {
    createProduct,
    updateProduct,
    isCreating,
    isUpdating,
    isLoading: isFetching,
  } = useProductsStore();

  // Track if we're in the initial loading phase for editing
  const [isInitiallyLoading, setIsInitiallyLoading] = useState(
    isEditing && !product
  );

  // Form state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<number[]>([]);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [documentErrors, setDocumentErrors] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name_ar: "",
      name_en: "",
      description_ar: "",
      description_en: "",
      main_category_id: 0,
      sub_category_id: undefined,
      micro_category_id: undefined,
      price: 0,
      discount_type: "none",
      discount_value: undefined,
      label: "none",
      is_active: true,
      display_order: undefined,
    },
  });

  // Load product data if editing
  useEffect(() => {
    if (product) {
      // Product loaded, stop initial loading state
      setIsInitiallyLoading(false);

      // Map single product API response to form structure
      form.reset({
        // Use single name field for both Arabic and English if separate fields don't exist
        name_ar: product.name_ar || product.name || "",
        name_en: product.name_en || product.name || "",
        // Use single description field for both if separate fields don't exist
        description_ar: product.description_ar || product.description || "",
        description_en: product.description_en || product.description || "",
        // Handle category IDs - use from nested objects if main_category_id doesn't exist
        main_category_id:
          product.main_category_id || product.main_category?.id || 0,
        sub_category_id: product.sub_category_id || product.sub_category?.id,
        micro_category_id:
          product.micro_category_id || product.micro_category?.id,
        price:
          typeof product.price === "string"
            ? parseFloat(product.price)
            : product.price,
        discount_type: product.discount_type,
        discount_value: product.discount_value
          ? typeof product.discount_value === "string"
            ? parseFloat(product.discount_value)
            : product.discount_value
          : undefined,
        label: product.label,
        is_active: product.is_active,
        display_order: product.display_order,
      });
    }
  }, [product, form]);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const fileErrors = validateImageFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        errors.push(...fileErrors);
      }
    });

    if (validFiles.length + selectedImages.length > 10) {
      errors.push("لا يمكن رفع أكثر من 10 صور");
      setImageErrors(errors);
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);
    setImageErrors(errors);

    // Clear the input
    event.target.value = "";
  };

  // Handle document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      const fileErrors = validateDocumentFile(file);
      if (fileErrors.length === 0) {
        validFiles.push(file);
      } else {
        errors.push(...fileErrors);
      }
    });

    if (validFiles.length + selectedDocuments.length > 5) {
      errors.push("لا يمكن رفع أكثر من 5 مستندات");
      setDocumentErrors(errors);
      return;
    }

    setSelectedDocuments((prev) => [...prev, ...validFiles]);
    setDocumentErrors(errors);

    // Clear the input
    event.target.value = "";
  };

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove selected document
  const removeSelectedDocument = (index: number) => {
    setSelectedDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // Mark existing image for deletion and immediately delete it
  const markImageForDeletion = async (mediaId: number) => {
    if (!product) return;

    try {
      const { deleteProductMedia } = useProductsStore.getState();
      const success = await deleteProductMedia(Number(product.id), mediaId);

      if (success) {
        setImagesToDelete((prev) => [...prev, mediaId]);
        toast.success(
          isRTL ? "تم حذف الصورة بنجاح" : "Image deleted successfully"
        );
      } else {
        toast.error(isRTL ? "فشل في حذف الصورة" : "Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error(isRTL ? "حدث خطأ أثناء حذف الصورة" : "Error deleting image");
    }
  };

  // Mark existing document for deletion and immediately delete it
  const markDocumentForDeletion = async (mediaId: number) => {
    if (!product) return;

    try {
      const { deleteProductMedia } = useProductsStore.getState();
      const success = await deleteProductMedia(Number(product.id), mediaId);

      if (success) {
        setDocumentsToDelete((prev) => [...prev, mediaId]);
        toast.success(
          isRTL ? "تم حذف المستند بنجاح" : "Document deleted successfully"
        );
      } else {
        toast.error(isRTL ? "فشل في حذف المستند" : "Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error(
        isRTL ? "حدث خطأ أثناء حذف المستند" : "Error deleting document"
      );
    }
  };

  // Handle file uploads for newly created products
  const handleFileUploads = async (productId: number) => {
    try {
      if (selectedImages.length > 0 || selectedDocuments.length > 0) {
        console.log(
          `📁 [PRODUCT FORM] Uploading files for product ${productId}`
        );

        const { uploadProductFiles } = useProductsStore.getState();
        const uploadResult = await uploadProductFiles(productId, {
          product_images:
            selectedImages.length > 0 ? selectedImages : undefined,
          product_documents:
            selectedDocuments.length > 0 ? selectedDocuments : undefined,
        });

        if (uploadResult && uploadResult.length > 0) {
          console.log(
            `✅ [PRODUCT FORM] Successfully uploaded ${uploadResult.length} files`
          );
        } else {
          console.warn(
            `⚠️ [PRODUCT FORM] File upload failed for product ${productId}`
          );
          toast.error(isRTL ? "فشل في رفع الملفات" : "Failed to upload files");
        }
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(
        isRTL
          ? "حدث خطأ أثناء رفع الملفات"
          : "Error occurred while uploading files"
      );
    }
  };

  // Handle file operations for product updates (delete old, upload new)
  const handleFileOperations = async (productId: number) => {
    try {
      const { deleteProductMedia, uploadProductFiles } =
        useProductsStore.getState();

      // 1. Delete marked files
      const filesToDelete = [...imagesToDelete, ...documentsToDelete];
      if (filesToDelete.length > 0) {
        console.log(
          `🗑️ [PRODUCT FORM] Deleting ${filesToDelete.length} marked files`
        );

        for (const mediaId of filesToDelete) {
          await deleteProductMedia(productId, mediaId);
        }

        console.log(`✅ [PRODUCT FORM] Successfully deleted marked files`);
      }

      // 2. Upload new files
      if (selectedImages.length > 0 || selectedDocuments.length > 0) {
        console.log(
          `📁 [PRODUCT FORM] Uploading new files for product ${productId}`
        );

        const uploadResult = await uploadProductFiles(productId, {
          product_images:
            selectedImages.length > 0 ? selectedImages : undefined,
          product_documents:
            selectedDocuments.length > 0 ? selectedDocuments : undefined,
        });

        if (uploadResult && uploadResult.length > 0) {
          console.log(
            `✅ [PRODUCT FORM] Successfully uploaded ${uploadResult.length} new files`
          );
        }
      }
    } catch (error) {
      console.error("File operations error:", error);
      toast.error(
        isRTL
          ? "حدث خطأ أثناء معالجة الملفات"
          : "Error occurred while processing files"
      );
    }
  };

  // Form submission
  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Prepare basic product data without files
      const basicProductData = {
        ...data,
        // Remove file fields - they'll be handled separately
      };

      let result: Product | null;

      if (isEditing && product) {
        // UPDATE WORKFLOW
        // 1. Update product details (without files)
        result = await updateProduct(Number(product.id), basicProductData);

        if (result) {
          // 2. Handle file operations after successful update
          await handleFileOperations(Number(product.id));

          toast.success(
            isRTL ? "تم تحديث المنتج بنجاح" : "Product updated successfully"
          );
          onSuccess?.(result);
        } else {
          toast.error(
            isRTL ? "فشل في تحديث المنتج" : "Failed to update product"
          );
        }
      } else {
        // CREATE WORKFLOW
        // 1. Create product first (without files)
        result = await createProduct(basicProductData);

        if (result) {
          // 2. Upload files after successful product creation
          if (selectedImages.length > 0 || selectedDocuments.length > 0) {
            await handleFileUploads(Number(result.id));
          }

          toast.success(
            isRTL ? "تم إنشاء المنتج بنجاح" : "Product created successfully"
          );
          onSuccess?.(result);
        } else {
          toast.error(
            isRTL ? "فشل في إنشاء المنتج" : "Failed to create product"
          );
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        isRTL
          ? "حدث خطأ أثناء حفظ المنتج"
          : "Error occurred while saving product"
      );
    }
  };

  const isLoading = isCreating || isUpdating;

  // Debug logging
  console.log("ProductForm - Debug:", {
    product: !!product,
    isEditing,
    isLoadingProduct,
    isFetching,
    isInitiallyLoading,
    shouldShowSkeleton:
      isLoadingProduct ||
      isInitiallyLoading ||
      (isEditing && isFetching && !product),
  });

  // Show skeleton when:
  // 1. Explicit isLoadingProduct prop is true
  // 2. We're in initial loading phase for edit mode
  // 3. We're editing, fetching, and don't have product yet
  const shouldShowSkeleton =
    isLoadingProduct ||
    isInitiallyLoading ||
    (isEditing && isFetching && !product);

  if (shouldShowSkeleton) {
    return <ProductFormSkeleton isRTL={isRTL} onCancel={onCancel} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isEditing
            ? isRTL
              ? "تعديل المنتج"
              : "Edit Product"
            : isRTL
            ? "إضافة منتج جديد"
            : "Add New Product"}
        </h1>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Button
            form="product-form"
            type="submit"
            disabled={isLoading}
            className="bg-design-main hover:bg-design-main-dark"
          >
            {isLoading
              ? isRTL
                ? "جاري الحفظ..."
                : "Saving..."
              : isEditing
              ? isRTL
                ? "تحديث"
                : "Update"
              : isRTL
              ? "إضافة"
              : "Add"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          id="product-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "المعلومات الأساسية" : "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL
                          ? "اسم المنتج (العربية)"
                          : "Product Name (Arabic)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="أدخل اسم المنتج بالعربية"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL
                          ? "اسم المنتج (الإنجليزية)"
                          : "Product Name (English)"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter product name in English"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL ? "الوصف (العربية)" : "Description (Arabic)"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل وصف المنتج بالعربية"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL ? "الوصف (الإنجليزية)" : "Description (English)"}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter product description in English"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "التصنيفات" : "Categories"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="main_category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL ? "الفئة الرئيسية" : "Main Category"} *
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value ? field.value.toString() : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isRTL
                                  ? "اختر الفئة الرئيسية"
                                  : "Select main category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">
                            {isRTL ? "مواد البناء" : "Building Materials"}
                          </SelectItem>
                          <SelectItem value="2">
                            {isRTL ? "أدوات" : "Tools"}
                          </SelectItem>
                          <SelectItem value="3">
                            {isRTL ? "معدات" : "Equipment"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sub_category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL ? "الفئة الفرعية" : "Sub Category"}
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(
                            value && value !== "none"
                              ? parseInt(value)
                              : undefined
                          )
                        }
                        value={field.value ? field.value.toString() : "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isRTL
                                  ? "اختر الفئة الفرعية"
                                  : "Select sub category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            {isRTL ? "بدون" : "None"}
                          </SelectItem>
                          <SelectItem value="1">
                            {isRTL ? "أسمنت" : "Cement"}
                          </SelectItem>
                          <SelectItem value="2">
                            {isRTL ? "حديد" : "Steel"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="micro_category_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL ? "الفئة الدقيقة" : "Micro Category"}
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(
                            value && value !== "none"
                              ? parseInt(value)
                              : undefined
                          )
                        }
                        value={field.value ? field.value.toString() : "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isRTL
                                  ? "اختر الفئة الدقيقة"
                                  : "Select micro category"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            {isRTL ? "بدون" : "None"}
                          </SelectItem>
                          <SelectItem value="1">
                            {isRTL ? "أنابيب" : "Pipes"}
                          </SelectItem>
                          <SelectItem value="2">
                            {isRTL ? "صمامات" : "Valves"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "التصنيف" : "Label"}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                isRTL ? "اختر التصنيف" : "Select label"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(PRODUCT_LABELS).map(
                            ([key, label]) => (
                              <SelectItem key={key} value={key}>
                                {isRTL ? label.ar : label.en}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "التسعير" : "Pricing"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isRTL ? "السعر" : "Price"} *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discount_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isRTL ? "نوع الخصم" : "Discount Type"}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            {isRTL ? "بدون خصم" : "No Discount"}
                          </SelectItem>
                          <SelectItem value="percent">
                            {isRTL ? "نسبة مئوية" : "Percentage"}
                          </SelectItem>
                          <SelectItem value="fixed">
                            {isRTL ? "مبلغ ثابت" : "Fixed Amount"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("discount_type") !== "none" && (
                  <FormField
                    control={form.control}
                    name="discount_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch("discount_type") === "percent"
                            ? isRTL
                              ? "نسبة الخصم %"
                              : "Discount %"
                            : isRTL
                            ? "مبلغ الخصم"
                            : "Discount Amount"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step={
                              form.watch("discount_type") === "percent"
                                ? "1"
                                : "0.01"
                            }
                            min="0"
                            max={
                              form.watch("discount_type") === "percent"
                                ? "100"
                                : undefined
                            }
                            placeholder="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status and Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? "الإعدادات" : "Settings"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel>
                    {isRTL ? "المنتج نشط" : "Product Active"}
                  </FormLabel>
                  <div className="text-sm text-muted-foreground">
                    {isRTL
                      ? "سيظهر المنتج في المتجر عندما يكون نشطاً"
                      : "Product will be visible in store when active"}
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          isRTL={isRTL}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="display_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isRTL ? "ترتيب العرض" : "Display Order"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || undefined)
                        }
                      />
                    </FormControl>
                    <div className="text-sm text-muted-foreground">
                      {isRTL
                        ? "رقم أصغر = أولوية أعلى في العرض"
                        : "Lower number = higher priority in display"}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* File Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>
                {isRTL ? "الصور والمستندات" : "Images & Documents"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    {isRTL ? "صور المنتج" : "Product Images"}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }
                    disabled={selectedImages.length >= 10}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isRTL ? "رفع صور" : "Upload Images"}
                  </Button>
                </div>

                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  aria-label={
                    isRTL ? "رفع صور المنتج" : "Upload product images"
                  }
                />

                {imageErrors.length > 0 && (
                  <div className="text-sm text-destructive space-y-1">
                    {imageErrors.map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                )}

                {/* Existing Images */}
                {((product?.product_images &&
                  product.product_images.length > 0) ||
                  (product?.images && product.images.length > 0)) && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(product.product_images || product.images || [])
                      .filter((img) => !imagesToDelete.includes(img.id))
                      .map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.original_url || image.url}
                            alt="Product"
                            className="w-full h-24 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={() => markImageForDeletion(image.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}

                {/* Selected Images */}
                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => removeSelectedImage(index)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                        <Badge className="absolute bottom-1 left-1 text-xs">
                          {isRTL ? "جديد" : "New"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Documents Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    {isRTL ? "مستندات المنتج" : "Product Documents"}
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("document-upload")?.click()
                    }
                    disabled={selectedDocuments.length >= 5}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isRTL ? "رفع مستندات" : "Upload Documents"}
                  </Button>
                </div>

                <input
                  id="document-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  aria-label={
                    isRTL ? "رفع مستندات المنتج" : "Upload product documents"
                  }
                />

                {documentErrors.length > 0 && (
                  <div className="text-sm text-destructive space-y-1">
                    {documentErrors.map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                )}

                {/* Existing Documents */}
                {((product?.product_documents &&
                  product.product_documents.length > 0) ||
                  (product?.documents && product.documents.length > 0)) && (
                  <div className="space-y-2">
                    {(product.product_documents || product.documents || [])
                      .filter((doc) => !documentsToDelete.includes(doc.id))
                      .map((document) => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">
                              {document.file_name ||
                                document.filename ||
                                document.name ||
                                "Unknown File"}
                            </span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => markDocumentForDeletion(document.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                  </div>
                )}

                {/* Selected Documents */}
                {selectedDocuments.length > 0 && (
                  <div className="space-y-2">
                    {selectedDocuments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded bg-muted/30"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {isRTL ? "جديد" : "New"}
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSelectedDocument(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

// Skeleton component for loading state when editing
function ProductFormSkeleton({
  isRTL,
  onCancel,
}: {
  isRTL: boolean;
  onCancel?: () => void;
}) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            {isRTL ? "إلغاء" : "Cancel"}
          </Button>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* Basic Information Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name fields */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Description fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Card */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-20" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-20" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-28" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
