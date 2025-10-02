"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Project } from "@/features/project/types/project";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  MapPin,
  DollarSign,
  Clock,
  Square,
  FileText,
  Settings,
  Building2,
} from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  getProjectTypeName: (typeId: number) => string;
  getCompletionStatus: (project: Project) => {
    completed: number;
    total: number;
    percentage: number;
  };
  getStatusBadge: (project: Project) => React.ReactNode;
  getNextStep: (project: Project) => string;
}

export function ProjectCard({
  project,
  getProjectTypeName,
  getCompletionStatus,
  getStatusBadge,
  getNextStep,
}: ProjectCardProps) {
  const t = useTranslations("projectsList");
  const status = getCompletionStatus(project);
  const nextStep = getNextStep(project);

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start mb-3">
          <CardTitle className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {project.essential_info.title}
          </CardTitle>
          {getStatusBadge(project)}
        </div>
        <CardDescription className="text-sm text-muted-foreground flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          {getProjectTypeName(project.essential_info.project_type_id)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-3 text-primary/70" />
            <span className="truncate">
              {project.essential_info.city}, {project.essential_info.district}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-3 text-green-600" />
            <span className="font-medium">
              {project.essential_info.budget.toLocaleString()}{" "}
              {project.essential_info.budget_unit}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-3 text-blue-600" />
            <span>
              {project.essential_info.duration_value}{" "}
              {project.essential_info.duration_unit}
            </span>
          </div>

          <div className="flex items-center text-sm text-muted-foreground">
            <Square className="h-4 w-4 mr-3 text-orange-600" />
            <span>{project.essential_info.area_sqm.toLocaleString()} m²</span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              {t("projectCard.progress.label")}
            </span>
            <span className="font-semibold text-foreground">
              {status.completed}/{status.total}{" "}
              {t("projectCard.progress.steps")}
            </span>
          </div>
          <Progress value={status.percentage} className="h-2 bg-muted" />
          <p className="text-xs text-muted-foreground">
            {t("projectCard.progress.nextStep")}: {nextStep}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/dashboard/individual/projects/${project.id}/edit`}
            className="flex-1"
          >
            <Button
              variant="outline"
              size="sm"
              className="w-full group-hover:border-primary/50 group-hover:text-primary transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("projectCard.actions.edit")}
            </Button>
          </Link>

          <Link
            href={`/dashboard/individual/projects/${project.id}`}
            className="flex-1"
          >
            <Button
              variant="default"
              size="sm"
              className="w-full group-hover:bg-primary/90 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              {t("projectCard.actions.view")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
