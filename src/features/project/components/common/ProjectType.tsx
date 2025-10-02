"use client";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import React, { useEffect, useState } from "react";
import { useProjectStore } from "@/features/project/store/projectStore";
import { projectApi } from "../../services/projectApi";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const ProjectType = ({
  onSelect,
  className,
  value,
  placeholder,
}: {
  onSelect: (value: number) => void;
  className?: string;
  value?: number;
  placeholder?: string;
}) => {
  const t = useTranslations();
  const { projectTypes, setProjectTypes } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (projectTypes) return;
    const fetchProjectTypes = async () => {
      setIsLoading(true);
      try {
        const result = await projectApi.getProjectTypes();
        if (result.success) {
          setProjectTypes(result.response);
        }
      } catch (error) {
        console.error("Failed to fetch project types:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjectTypes();
  }, [projectTypes, setProjectTypes]);

  // Show loading state
  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className={cn("w-full !h-10", className)}>
          <SelectValue placeholder={t("common.actions.loading")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="loading" disabled>
            {t("common.actions.loading")}
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  // Show placeholder when no value is selected (value is 0, null, or undefined)
  const hasValue = value && value > 0;
  const displayValue = hasValue ? value.toString() : undefined;

  return (
    <Select
      value={displayValue}
      onValueChange={(value) => {
        onSelect(parseInt(value));
      }}
    >
      <SelectTrigger className={cn("w-full !h-10", className)}>
        <SelectValue
          placeholder={placeholder || t("project.step1.typePlaceholder")}
        />
      </SelectTrigger>
      <SelectContent className="w-full">
        {projectTypes?.map((projectType) => (
          <SelectItem key={projectType.id} value={projectType.id.toString()}>
            {projectType.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ProjectType;
