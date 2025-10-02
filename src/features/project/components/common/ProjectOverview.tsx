"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { useProjectStore } from "@/features/project/store/projectStore";

const ProjectOverview = () => {
  const t = useTranslations("");
  const { project } = useProjectStore();
  const { projectTypes } = useProjectStore();
  return (
    <div className="w-full space-y-6">
      <div className="w-full p-2">
        <h2 className="text-sm font-medium text-design-main mb-2">
          {t("project.step6.name")}
        </h2>
        <p className="text-base font-medium text-foreground">
          {project?.essential_info.title || "—"}
        </p>
      </div>

      <div className="w-full p-2">
        <h2 className="text-sm font-medium text-design-main mb-2">
          {t("project.step6.description")}
        </h2>
        <p className="text-base text-foreground leading-relaxed">
          {project?.essential_info.description || "—"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.type")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {projectTypes?.find(
              (type) => type.id === project?.essential_info.project_type_id
            )?.name || "—"}
          </p>
        </div>

        <div className="p-2">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.budget")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {project?.essential_info.budget
              ? `${project.essential_info.budget} ${
                  project.essential_info.budget_unit || "SAR"
                }`
              : "—"}
          </p>
        </div>

        <div className="p-2">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.duration")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {project?.essential_info.duration_value &&
            project?.essential_info.duration_unit
              ? `${project.essential_info.duration_value} ${project.essential_info.duration_unit}`
              : "—"}
          </p>
        </div>

        <div className="p-4">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.area_sqm")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {project?.essential_info.area_sqm
              ? `${project.essential_info.area_sqm} sqm`
              : "—"}
          </p>
        </div>

        <div className="p-2">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.location")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {project?.essential_info.location || "—"}
          </p>
        </div>

        <div className="p-2">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.city")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {project?.essential_info.city || "—"}
          </p>
        </div>

        <div className="p-2">
          <h2 className="text-sm font-medium text-design-main mb-2">
            {t("project.step6.district")}
          </h2>
          <p className="text-base font-medium text-foreground">
            {project?.essential_info.district || "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
