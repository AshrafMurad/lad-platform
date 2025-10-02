"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type DurationSelectProps = {
  onSelect: (value: string) => void;
  value?: string;
  triggerClassName?: string;
  placeholder?: string;
};

const DurationSelect = ({
  onSelect,
  value,
  triggerClassName,
  placeholder,
}: DurationSelectProps) => {
  const t = useTranslations("");
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger size="sm" className={cn("w-fit", triggerClassName)}>
        <SelectValue
          placeholder={placeholder ?? t("common.select.duration")}
          className="w-full"
        />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value={"DAY"}>{t("common.select.day")}</SelectItem>
        <SelectItem value={"WEEK"}>{t("common.select.week")}</SelectItem>
        <SelectItem value={"MONTH"}>{t("common.select.month")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DurationSelect;
