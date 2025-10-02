import { z } from "zod";
import { getValidationMessages } from "./validationMessages";

// Regex patterns
const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/; // Arabic and English characters only
const saPhoneRegex = /^05[0-9]{8}$/; // Saudi phone number format: 05XXXXXXXX (local format only)
const nationalIdRegex = /^[0-9]{10}$/; // 10 digits
const commercialRegisterRegex = /^[0-9]{10}$/; // 10 digits

// Factory function to create validation schemas with translation support
export const createValidationSchemas = (t: (key: string) => string) => {
  const messages = getValidationMessages(t);

  const passwordValidation = z
    .string()
    .min(8, messages.password.minLength)
    .refine((password) => /[a-z]/.test(password), {
      message: messages.password.lowercase,
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: messages.password.uppercase,
    })
    .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
      message: messages.password.symbol,
    });
  const baseRegistrationSchema = z
    .object({
      name: z
        .string({ error: messages.name.required })
        .min(2, messages.name.minLength)
        .max(255, messages.name.maxLength)
        .regex(nameRegex, messages.name.invalid),
      email: z
        .string({ error: messages.email.required })
        .email(messages.email.invalid)
        .max(255, messages.email.maxLength),
      phone: z
        .string({ error: messages.phone.required })
        .regex(saPhoneRegex, messages.phone.invalid),
      password: passwordValidation,
      password_confirmation: z.string({
        error: messages.confirmPassword.required,
      }),
      country_id: z
        .string({ error: messages.country.required })
        .max(100)
        .optional(),
      commercial_register_file: z.any().optional(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: messages.confirmPassword.mismatch,
      path: ["password_confirmation"],
    });
  // Unified schema for individual personal information (replaces individualUnifiedPersonalInfoSchema)
  const individualRegistrationSchema = baseRegistrationSchema.extend({
    national_id: z
      .string({ error: messages.nationalId.required })
      .regex(nationalIdRegex, messages.nationalId.invalid),
  });

  const supplierRegistrationSchema = baseRegistrationSchema.extend({
    business_name: z
      .string({ error: messages.businessName.required })
      .min(2, messages.businessName.minLength)
      .max(255, messages.businessName.maxLength),
    commercial_register_number: z
      .string({ error: messages.commercialRegisterNumber.required })
      .regex(
        commercialRegisterRegex,
        messages.commercialRegisterNumber.invalid
      ),
    commercial_register_file: z
      .any()
      .refine((file) => file instanceof File, {
        message: messages.commercialRegisterFile.required,
      })
      .refine((file) => !file || file.size <= 8 * 1024 * 1024, {
        message: messages.commercialRegisterFile.maxSize,
      })
      .refine(
        (file) => {
          if (!file) return true;
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return allowedTypes.includes(file.type);
        },
        {
          message: messages.commercialRegisterFile.invalidType,
        }
      ),
  });

  const engineeringOfficeRegistrationSchema = baseRegistrationSchema.extend({
    business_name: z
      .string({ error: messages.businessName.required })
      .min(2, messages.businessName.minLength)
      .max(255, messages.businessName.maxLength),
    license_number: z
      .string({ error: messages.licenseNumber.required })
      .min(1, messages.licenseNumber.required)
      .max(50, messages.licenseNumber.maxLength),
    commercial_register_number: z
      .string({ error: messages.commercialRegisterNumber.required })
      .regex(
        commercialRegisterRegex,
        messages.commercialRegisterNumber.invalid
      ),
    commercial_register_file: z
      .any()
      .refine((file) => file instanceof File, {
        message: messages.commercialRegisterFile.required,
      })
      .refine((file) => !file || file.size <= 8 * 1024 * 1024, {
        message: messages.commercialRegisterFile.maxSize,
      })
      .refine(
        (file) => {
          if (!file) return true;
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return allowedTypes.includes(file.type);
        },
        {
          message: messages.commercialRegisterFile.invalidType,
        }
      ),
  });

  const freelanceEngineerRegistrationSchema = baseRegistrationSchema.extend({
    engineers_association_number: z
      .string({ error: messages.engineersAssociationNumber.required })
      .max(50, messages.engineersAssociationNumber.maxLength)
      .min(1, messages.engineersAssociationNumber.required),
    commercial_register_file: z
      .any()
      .refine((file) => file instanceof File, {
        message: messages.commercialRegisterFile.required,
      })
      .refine((file) => !file || file.size <= 8 * 1024 * 1024, {
        message: messages.commercialRegisterFile.maxSize,
      })
      .refine(
        (file) => {
          if (!file) return true;
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return allowedTypes.includes(file.type);
        },
        {
          message: messages.commercialRegisterFile.invalidType,
        }
      ),
  });

  const contractorRegistrationSchema = baseRegistrationSchema.extend({
    business_name: z
      .string({ error: messages.businessName.required })
      .min(2, messages.businessName.minLength)
      .max(255, messages.businessName.maxLength),
    commercial_register_number: z
      .string({ error: messages.commercialRegisterNumber.required })
      .regex(
        commercialRegisterRegex,
        messages.commercialRegisterNumber.invalid
      ),
    commercial_register_file: z
      .any()
      .refine((file) => file instanceof File, {
        message: messages.commercialRegisterFile.required,
      })
      .refine((file) => !file || file.size <= 8 * 1024 * 1024, {
        message: messages.commercialRegisterFile.maxSize,
      })
      .refine(
        (file) => {
          if (!file) return true;
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return allowedTypes.includes(file.type);
        },
        {
          message: messages.commercialRegisterFile.invalidType,
        }
      ),
  });

  const governmentalRegistrationSchema = baseRegistrationSchema.extend({
    commercial_register_number: z
      .string({ error: messages.commercialRegisterNumber.required })
      .regex(
        commercialRegisterRegex,
        messages.commercialRegisterNumber.invalid
      ),
  });

  const organizationRegistrationSchema = baseRegistrationSchema.extend({
    business_name: z
      .string({ error: messages.businessName.required })
      .min(2, messages.businessName.minLength)
      .max(255, messages.businessName.maxLength),
    commercial_register_number: z
      .string({ error: messages.commercialRegisterNumber.required })
      .regex(
        commercialRegisterRegex,
        messages.commercialRegisterNumber.invalid
      ),
    commercial_register_file: z
      .any()
      .refine((file) => file instanceof File, {
        message: messages.commercialRegisterFile.required,
      })
      .refine((file) => !file || file.size <= 8 * 1024 * 1024, {
        message: messages.commercialRegisterFile.maxSize,
      })
      .refine(
        (file) => {
          if (!file) return true;
          const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
          ];
          return allowedTypes.includes(file.type);
        },
        {
          message: messages.commercialRegisterFile.invalidType,
        }
      ),
  });

  const OTPVerificationSchema = z.object({
    otp: z.string().length(6, { message: messages.otp.length }),
  });

  // Password Reset Schemas
  const PasswordResetSchema = z.object({
    email: z.string().email(messages.email.invalid),
  });

  const NewPasswordSchema = z
    .object({
      password: passwordValidation,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: messages.confirmPassword.mismatch,
      path: ["confirmPassword"],
    });

  const passwordResetSchema = z.object({
    emailOrPhone: z
      .string()
      .min(1, messages.emailOrPhone.required)
      .refine((value) => {
        // Check if it's a valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Check if it's a valid phone (simple check for digits and common phone chars)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      }, messages.emailOrPhone.invalid),
  });

  return {
    individualRegistrationSchema,
    organizationRegistrationSchema,
    supplierRegistrationSchema,
    engineeringOfficeRegistrationSchema,
    freelanceEngineerRegistrationSchema,
    contractorRegistrationSchema,
    governmentalRegistrationSchema,
    OTPVerificationSchema,
    PasswordResetSchema,
    NewPasswordSchema,
    passwordResetSchema,
    baseRegistrationSchema,
  };
};
