import { z } from "zod";
import { VALIDATION_RULES, FILE_CONSTRAINTS } from "@/constants/global";

// Product Form Validation Schema (without file fields - those are managed via state)
export const productFormSchema = z
  .object({
    name_ar: z
      .string()
      .min(
        VALIDATION_RULES.MIN_NAME_LENGTH,
        "الاسم يجب أن يكون على الأقل حرفين"
      )
      .max(
        VALIDATION_RULES.MAX_NAME_LENGTH,
        "الاسم لا يمكن أن يزيد عن 100 حرف"
      ),

    name_en: z
      .string()
      .min(
        VALIDATION_RULES.MIN_NAME_LENGTH,
        "Name must be at least 2 characters"
      )
      .max(
        VALIDATION_RULES.MAX_NAME_LENGTH,
        "Name cannot exceed 100 characters"
      ),

    description_ar: z
      .string()
      .max(
        VALIDATION_RULES.MAX_DESCRIPTION_LENGTH,
        "الوصف لا يمكن أن يزيد عن 1000 حرف"
      )
      .optional(),

    description_en: z
      .string()
      .max(
        VALIDATION_RULES.MAX_DESCRIPTION_LENGTH,
        "Description cannot exceed 1000 characters"
      )
      .optional(),

    main_category_id: z.number().min(1, "يرجى اختيار الفئة الرئيسية"),

    sub_category_id: z.number().optional(),

    micro_category_id: z.number().optional(),

    price: z
      .number()
      .min(0.01, "السعر يجب أن يكون أكبر من صفر")
      .max(999999.99, "السعر كبير جداً"),

    discount_type: z.enum(["none", "percent", "fixed"]),

    discount_value: z
      .number()
      .min(0, "قيمة الخصم لا يمكن أن تكون سالبة")
      .optional(),

    label: z.enum(["none", "best_seller", "special_offer"]),

    is_active: z.boolean(),

    display_order: z.number().min(0).optional(),

    // Note: File fields (product_images, product_documents, files_to_delete)
    // are handled via component state, not form fields
  })
  .refine(
    (data) => {
      // Validate discount value based on type
      if (data.discount_type !== "none" && data.discount_type) {
        if (!data.discount_value || data.discount_value <= 0) {
          return false;
        }

        if (data.discount_type === "percent" && data.discount_value > 100) {
          return false;
        }

        if (
          data.discount_type === "fixed" &&
          data.discount_value >= data.price
        ) {
          return false;
        }
      }

      return true;
    },
    {
      message: "قيمة الخصم غير صالحة",
      path: ["discount_value"],
    }
  );

export type ProductFormValues = z.infer<typeof productFormSchema>;

// File validation helpers
export const validateImageFile = (file: File): string[] => {
  const errors: string[] = [];

  if (file.size > FILE_CONSTRAINTS.MAX_IMAGE_SIZE) {
    errors.push(
      `الصورة كبيرة جداً. الحد الأقصى ${
        FILE_CONSTRAINTS.MAX_IMAGE_SIZE / (1024 * 1024)
      }MB`
    );
  }

  if (
    !(FILE_CONSTRAINTS.ALLOWED_IMAGE_TYPES as readonly string[]).includes(
      file.type
    )
  ) {
    errors.push("نوع الصورة غير مدعوم. المسموح: JPG, PNG, WebP");
  }

  return errors;
};

export const validateDocumentFile = (file: File): string[] => {
  const errors: string[] = [];

  if (file.size > FILE_CONSTRAINTS.MAX_DOCUMENT_SIZE) {
    errors.push(
      `المستند كبير جداً. الحد الأقصى ${
        FILE_CONSTRAINTS.MAX_DOCUMENT_SIZE / (1024 * 1024)
      }MB`
    );
  }

  if (
    !(FILE_CONSTRAINTS.ALLOWED_DOCUMENT_TYPES as readonly string[]).includes(
      file.type
    )
  ) {
    errors.push("نوع المستند غير مدعوم. المسموح: PDF, DOC, DOCX");
  }

  return errors;
};
