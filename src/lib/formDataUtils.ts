/**
 * Advanced FormData utilities for handling complex data structures
 * These utilities are reusable across the entire project
 */

export interface FileUploadConfig {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxFiles?: number;
}

export interface FormDataOptions {
  arrayBrackets?: boolean; // Use [] for arrays (default: true)
  nestedObjects?: boolean; // Support nested objects (default: true)
  fileConfig?: FileUploadConfig; // Single file config
  fileFields?: Record<string, FileUploadConfig>; // Multiple file field configs
  validateFiles?: boolean; // Enable file validation (default: false)
  excludeEmptyFiles?: boolean; // Exclude empty file arrays (default: false)
}

/**
 * Validate file against configuration
 */
export function validateFile(file: File, config?: FileUploadConfig): string[] {
  const errors: string[] = [];

  if (!config) return errors;

  // Check file size
  if (config.maxSize && file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`File size exceeds ${maxSizeMB}MB limit`);
  }

  // Check file type
  if (config.allowedTypes && config.allowedTypes.length > 0) {
    const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    const mimeType = file.type.toLowerCase();

    const isAllowed = config.allowedTypes.some(
      (type) =>
        type.toLowerCase() === fileExtension ||
        type.toLowerCase() === mimeType ||
        (type.includes("*") && mimeType.startsWith(type.replace("*", "")))
    );

    if (!isAllowed) {
      errors.push(`File type ${fileExtension} is not allowed`);
    }
  }

  return errors;
}

/**
 * Validate multiple files against configuration
 */
export function validateFiles(
  files: File[],
  config?: FileUploadConfig
): string[] {
  const errors: string[] = [];

  if (!config) return errors;

  // Check maximum number of files
  if (config.maxFiles && files.length > config.maxFiles) {
    errors.push(`Maximum ${config.maxFiles} files allowed`);
  }

  // Validate each file
  files.forEach((file, index) => {
    const fileErrors = validateFile(file, config);
    fileErrors.forEach((error) => {
      errors.push(`File ${index + 1}: ${error}`);
    });
  });

  return errors;
}

/**
 * Enhanced FormData conversion with advanced options
 */
export function toFormData(
  obj: any,
  options: FormDataOptions = {},
  formData?: FormData,
  parentKey?: string
): FormData {
  const {
    arrayBrackets = true,
    nestedObjects = true,
    fileConfig,
    fileFields,
    validateFiles: shouldValidateFiles = false,
    excludeEmptyFiles = false,
  } = options;

  formData = formData || new FormData();

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const formKey = parentKey
      ? arrayBrackets
        ? `${parentKey}[${key}]`
        : `${parentKey}.${key}`
      : key;

    if (value === null || value === undefined) {
      // Skip null/undefined values
      continue;
    } else if (value instanceof File) {
      // Get config for this specific field or use general config
      const currentFileConfig = fileFields?.[key] || fileConfig;

      // Validate file if requested
      if (shouldValidateFiles && currentFileConfig) {
        const errors = validateFile(value, currentFileConfig);
        if (errors.length > 0) {
          throw new Error(
            `File validation failed for ${key}: ${errors.join(", ")}`
          );
        }
      }
      formData.append(formKey, value);
    } else if (value instanceof FileList) {
      const files = Array.from(value);

      // Skip empty file arrays if requested
      if (excludeEmptyFiles && files.length === 0) {
        continue;
      }

      // Get config for this specific field or use general config
      const currentFileConfig = fileFields?.[key] || fileConfig;

      // Validate files if requested
      if (shouldValidateFiles && currentFileConfig) {
        const errors = validateFiles(files, currentFileConfig);
        if (errors.length > 0) {
          throw new Error(
            `File validation failed for ${key}: ${errors.join(", ")}`
          );
        }
      }

      files.forEach((file, index) => {
        formData!.append(
          arrayBrackets ? `${formKey}[${index}]` : `${formKey}.${index}`,
          file
        );
      });
    } else if (Array.isArray(value)) {
      // Handle arrays
      if (excludeEmptyFiles && value.length === 0 && key.includes("file")) {
        continue;
      }

      value.forEach((item, index) => {
        const arrayKey = arrayBrackets
          ? `${formKey}[${index}]`
          : `${formKey}.${index}`;

        if (item instanceof File || item instanceof Blob) {
          // Get config for this specific field or use general config
          const currentFileConfig = fileFields?.[key] || fileConfig;

          if (
            shouldValidateFiles &&
            item instanceof File &&
            currentFileConfig
          ) {
            const errors = validateFile(item, currentFileConfig);
            if (errors.length > 0) {
              throw new Error(
                `File validation failed for ${key}[${index}]: ${errors.join(
                  ", "
                )}`
              );
            }
          }
          formData!.append(arrayKey, item);
        } else if (typeof item === "object" && item !== null && nestedObjects) {
          toFormData(item, options, formData, arrayKey);
        } else {
          formData!.append(arrayKey, String(item));
        }
      });
    } else if (
      typeof value === "object" &&
      !(value instanceof Date) &&
      nestedObjects
    ) {
      // Handle nested objects (but not Date objects)
      toFormData(value, options, formData, formKey);
    } else if (value instanceof Date) {
      // Handle Date objects by converting to ISO string
      formData.append(formKey, value.toISOString());
    } else if (typeof value === "boolean") {
      // Handle boolean values
      formData.append(formKey, value ? "1" : "0");
    } else {
      // Handle primitive values
      formData.append(formKey, String(value));
    }
  }

  return formData;
}

/**
 * Extract files from FormData (useful for debugging)
 */
export function extractFilesFromFormData(formData: FormData): {
  [key: string]: File[];
} {
  const files: { [key: string]: File[] } = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!files[key]) files[key] = [];
      files[key].push(value);
    }
  }

  return files;
}

/**
 * Get FormData entries as an object (useful for debugging)
 */
export function formDataToObject(formData: FormData): { [key: string]: any } {
  const obj: { [key: string]: any } = {};

  for (const [key, value] of formData.entries()) {
    if (obj[key]) {
      // Convert to array if multiple values exist
      if (Array.isArray(obj[key])) {
        obj[key].push(value);
      } else {
        obj[key] = [obj[key], value];
      }
    } else {
      obj[key] = value;
    }
  }

  return obj;
}

/**
 * Check if an object contains files (used by apiClient)
 */
export function containsFiles(obj: any): boolean {
  if (!obj || typeof obj !== "object") return false;

  for (const key in obj) {
    const value = obj[key];

    // Check for File instance
    if (value instanceof File) return true;

    // Check for FileList
    if (value instanceof FileList) return true;

    // Check for Blob
    if (value instanceof Blob) return true;

    // Check for array of files
    if (
      Array.isArray(value) &&
      value.some((item) => item instanceof File || item instanceof Blob)
    )
      return true;

    // Recursively check nested objects
    if (typeof value === "object" && value !== null && containsFiles(value)) {
      return true;
    }
  }

  return false;
}

// Export default configuration
export const DEFAULT_FILE_CONFIG: FileUploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  allowedTypes: [
    // Images
    "image/*",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    // Documents
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".rtf",
    // Other
    ".zip",
    ".rar",
  ],
};

export const IMAGE_FILE_CONFIG: FileUploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  allowedTypes: ["image/*", ".jpg", ".jpeg", ".png", ".gif", ".webp"],
};

export const DOCUMENT_FILE_CONFIG: FileUploadConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5,
  allowedTypes: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
};
