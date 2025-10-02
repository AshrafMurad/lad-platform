"use client";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect } from "react";
import { useProjectStore } from "../../store/projectStore";
import { twMerge } from "tailwind-merge";
import { useGlobalStore } from "@/shared/store/globalStore";

const NavigationButtons = ({
  onSubmit,
  isLoading,
}: {
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  const t = useTranslations("");
  const { currentStep, setCurrentStep, projectStatus, completedSteps } =
    useProjectStore();
  const { locale } = useGlobalStore();
  const onBack = () => {
    if (currentStep === 1) return;
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    console.log(currentStep);
  }, [currentStep]);
  return (
    <div className="w-full grid grid-cols-2 gap-4 items-center">
      {currentStep !== 1 && projectStatus.status === "in_progress" ? (
        <Button
          variant="outline"
          className="w-full max-w-xs mx-auto"
          onClick={onBack}
        >
          <ArrowLeft
            className={twMerge("h-4 w-4", locale === "ar" && "rotate-180")}
          />
          {t("common.actions.previous")}
        </Button>
      ) : (
        <div></div>
      )}
      <Button
        onClick={onSubmit}
        type="button"
        variant="default"
        className={twMerge(
          "w-full max-w-xs mx-auto",
          projectStatus.status === "pending_review" && "bg-p-7"
        )}
      >
        {isLoading
          ? t("common.actions.loading")
          : currentStep === 6 && projectStatus.status === "in_progress"
          ? t("project.step6.submit")
          : currentStep === 6 && projectStatus.status === "pending_review"
          ? t("project.step6.pending_review")
          : t("common.actions.continue")}
      </Button>
    </div>
  );
};

export default NavigationButtons;
