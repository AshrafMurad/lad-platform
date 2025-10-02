"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useProjectData } from "@/features/project/hooks/useProjectData";
import { Project } from "@/features/project/types/project";
import { ProjectCard } from "@/features/project/components/display/ProjectCard";
import { ProjectTabs } from "@/features/project/components/display/ProjectTabs";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/shared/components/ui/pagination";
import { Package, Plus, Building2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectsPage = () => {
  const t = useTranslations("projectsList");
  const { getMockProjects } = useProjectData();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
    // Simulate loading delay
    const loadProjects = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      const allProjects = getMockProjects();
      setProjects(allProjects);
      setLoading(false);
    };

    loadProjects();
  }, [getMockProjects]);

  const getProjectTypeName = (typeId: number) => {
    return t(`projectTypes.${typeId}`) || t("projectTypes.unknown");
  };

  const getCompletionStatus = (project: Project) => {
    let stepsCompleted = 0;
    const totalSteps = 5;

    // Check Essential Info completion
    if (
      project.essential_info.title &&
      project.essential_info.project_type_id > 0
    ) {
      stepsCompleted++;
    }

    // Check Classification completion
    if (
      project.classification.jobId > 0 &&
      project.classification.workTypeId > 0 &&
      project.classification.levelId > 0
    ) {
      stepsCompleted++;
    }

    // Check Documents completion
    const hasDocuments =
      project.documents.architectural_plans.length > 0 ||
      project.documents.licenses.length > 0 ||
      project.documents.specifications.length > 0 ||
      project.documents.site_photos.length > 0;
    if (hasDocuments) {
      stepsCompleted++;
    }

    // Check BOQ completion
    if (project.boq.items.length > 0) {
      stepsCompleted++;
    }

    // Check Publish Settings completion
    if (project.publish_settings.offers_window_days > 0) {
      stepsCompleted++;
    }

    return {
      completed: stepsCompleted,
      total: totalSteps,
      percentage: Math.round((stepsCompleted / totalSteps) * 100),
    };
  };

  const getStatusBadge = (project: Project) => {
    const status = getCompletionStatus(project);

    if (status.completed === 0) {
      return (
        <Badge variant="secondary">{t("projectCard.status.notStarted")}</Badge>
      );
    } else if (status.completed === status.total) {
      return (
        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
          {t("projectCard.status.completed")}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">{t("projectCard.status.inProgress")}</Badge>
      );
    }
  };

  const getNextStep = (project: Project) => {
    const status = getCompletionStatus(project);

    if (status.completed === 0) return t("steps.essentialInfo");
    if (status.completed === 1) return t("steps.classification");
    if (status.completed === 2) return t("steps.documents");
    if (status.completed === 3) return t("steps.boq");
    if (status.completed === 4) return t("steps.publishSettings");
    return t("steps.completed");
  };

  // Filter projects based on active tab
  const filteredProjects = useMemo(() => {
    if (activeTab === "all") return projects;

    return projects.filter((project) => {
      const status = getCompletionStatus(project);

      switch (activeTab) {
        case "inProgress":
          return status.completed > 0 && status.completed < status.total;
        case "draft":
          return status.completed === 0;
        case "pendingOffers":
          // Mock logic - in real app this would check if project has pending offers
          return Math.random() > 0.7;
        case "pendingReview":
          // Mock logic - in real app this would check if project is under review
          return Math.random() > 0.8;
        case "pendingSigning":
          // Mock logic - in real app this would check if project is pending signing
          return Math.random() > 0.9;
        case "completed":
          return status.completed === status.total;
        default:
          return true;
      }
    });
  }, [projects, activeTab]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Projects Grid Skeleton */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-3">
            <Building2 className="h-4 w-4 text-design-main" />
            {t("title")}
          </h1>
        </div>
      </div>

      {/* Project Tabs */}
      <div className="w-full overflow-hidden">
        <ProjectTabs
          projects={projects}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getCompletionStatus={getCompletionStatus}
        />
      </div>

      {/* Projects Grid */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            getProjectTypeName={getProjectTypeName}
            getCompletionStatus={getCompletionStatus}
            getStatusBadge={getStatusBadge}
            getNextStep={getNextStep}
          />
        ))}
      </div>

      {/* Pagination */}
      {filteredProjects.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="text-sm text-muted-foreground">
            {t("pagination.showing")} {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredProjects.length)} {t("pagination.of")}{" "}
            {filteredProjects.length} {t("pagination.results")}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                      className="cursor-pointer"
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="mx-auto w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {t("emptyState.title")}
          </h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {t("emptyState.description")}
          </p>
          <Link href="/dashboard/individual/projects/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              {t("emptyState.createButton")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
