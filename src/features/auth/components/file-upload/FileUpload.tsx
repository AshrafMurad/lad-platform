"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

interface FileUploadProps {
  value?: File;
  onChange: (file: File | undefined) => void;
  disabled?: boolean;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  id?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  disabled = false,
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  maxSizeMB = 8,
  label,
  placeholder,
  error,
  className,
  id,
}) => {
  const tCommon = useTranslations("common");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        // This will be handled by the parent form's error handling
        return;
      }

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(file.type)) {
        // This will be handled by the parent form's error handling
        return;
      }

      onChange(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const handleClick = () => {
    if (!disabled) {
      document.getElementById(id || "file-upload")?.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2);
  };

  const getFileTypeText = () => {
    const types = accept
      .split(",")
      .map((type) => type.trim().replace(".", "").toUpperCase());
    return types.join(", ");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{label}</span>
        </div>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
          "hover:bg-muted/50 hover:border-muted-foreground/50",
          value ? "border-design-main" : "border-muted-foreground/25",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500"
        )}
        onClick={handleClick}
      >
        <input
          id={id || "file-upload"}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>

          {value ? (
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-700">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)} MB
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="h-6 px-2 text-xs"
                disabled={disabled}
              >
                <X className="w-3 h-3 mr-1" />
                {tCommon("actions.remove")}
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {placeholder || tCommon("actions.upload")} {label}
              </p>
              <p className="text-xs text-muted-foreground">
                {getFileTypeText()} (max {maxSizeMB}MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileUpload;
