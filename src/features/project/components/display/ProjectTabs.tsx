"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/shared/components/ui/badge";
import { Project } from "@/features/project/types/project";

interface ProjectTabsProps {
  projects: Project[];
  activeTab: string;
  onTabChange: (value: string) => void;
  getCompletionStatus: (project: Project) => {
    completed: number;
    total: number;
    percentage: number;
  };
}

export function ProjectTabs({
  projects,
  activeTab,
  onTabChange,
  getCompletionStatus,
}: ProjectTabsProps) {
  const t = useTranslations("projectsList");

  // Calculate project counts for each status
  const allCount = projects.length;
  const inProgressCount = projects.filter((p) => {
    const status = getCompletionStatus(p);
    return status.completed > 0 && status.completed < status.total;
  }).length;
  const draftCount = projects.filter((p) => {
    const status = getCompletionStatus(p);
    return status.completed === 0;
  }).length;
  const pendingOffersCount = projects.filter((p) => {
    // Mock logic - in real app this would check if project has pending offers
    return Math.random() > 0.7; // Simulate some projects having pending offers
  }).length;
  const pendingReviewCount = projects.filter((p) => {
    // Mock logic - in real app this would check if project is under review
    return Math.random() > 0.8; // Simulate some projects under review
  }).length;
  const pendingSigningCount = projects.filter((p) => {
    // Mock logic - in real app this would check if project is pending signing
    return Math.random() > 0.9; // Simulate some projects pending signing
  }).length;
  const completedCount = projects.filter((p) => {
    const status = getCompletionStatus(p);
    return status.completed === status.total;
  }).length;

  const tabs = [
    {
      value: "all",
      label: t("tabs.all"),
      count: allCount,
    },
    {
      value: "inProgress",
      label: t("tabs.inProgress"),
      count: inProgressCount,
    },
    {
      value: "draft",
      label: t("tabs.draft"),
      count: draftCount,
    },
    {
      value: "pendingOffers",
      label: t("tabs.pendingOffers"),
      count: pendingOffersCount,
    },
    {
      value: "pendingReview",
      label: t("tabs.pendingReview"),
      count: pendingReviewCount,
    },
    {
      value: "pendingSigning",
      label: t("tabs.pendingSigning"),
      count: pendingSigningCount,
    },
    {
      value: "completed",
      label: t("tabs.completed"),
      count: completedCount,
    },
  ];

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="inline-flex w-max min-w-full gap-1 p-1 h-13 rounded-full backdrop-blur-sm border shadow-md snap-x snap-mandatory">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-design-main data-[state=active]:to-p-6 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 text-xs px-3 py-2 min-w-fit flex-shrink-0 whitespace-nowrap snap-start touch-pan-x rounded-full group"
            >
              <span className="text-center leading-tight text-[10px] sm:text-xs font-medium">
                {tab.label}
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] sm:text-xs bg-transparent text-design-main group-data-[state=active]:text-white h-4 sm:h-5 min-w-4 sm:min-w-5 flex items-center justify-center rounded-full font-semibold"
              >
                {tab.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
