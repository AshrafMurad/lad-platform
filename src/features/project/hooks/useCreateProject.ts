import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../store/projectStore";
import { projectApi } from "../services/projectApi";
import {
  ProjectClassification,
  ProjectEssentialInfo,
  PublishSettings,
  DocumentFile,
  DocumentsState,
  Project,
  ProjectStatus,
  BOQData,
  UserProject,
} from "../types/project";
import { useProjectsStore } from "../store/ProjectsStore";

export const useCreateProject = () => {
  const router = useRouter();
  const {
    isLoading,
    error,
    clearError,
    setLoading,
    projectId,
    setProjectId,
    currentStep,
    completedSteps,
    setCurrentStep,
    setCompletedSteps,
    hasClassificationDataChanged,
    originalClassificationData,
    setOriginalClassificationData,
    projectClassificationJobs,
    projectClassificationLevels,
    workTypes,
    hasEssentialInfoDataChanged,
    originalEssentialInfoData,
    setOriginalEssentialInfoData,
    projectTypes,
    documents,
    addDocumentFile,
    updateDocumentFile,
    removeDocumentFile,
    hasBOQDataChanged,
    setOriginalBOQData,
    hasPublishSettingsChanged,
    publishSettings,
    setPublishSettings,
    setProjectStatus,
    project,
    setProject,
    resetProjectCreation,
    isProjectCreationComplete,
    projectStatus,
    boqData,
  } = useProjectStore();
  const {
    addProject,
    updateProject,
    setLoading: setProjectsLoading,
    setError: setProjectsError,
    setProjects,
    projects,
  } = useProjectsStore();

  const submitClassification = useCallback(
    async (data: {
      jobId: number;
      levelId: number;
      workTypeId: number;
      notes?: string;
    }) => {
      if (!projectId) {
        console.error("No project ID available");
        return { success: false, message: "No project ID available" };
      }

      try {
        clearError();
        setLoading(true);

        const shouldCreate = completedSteps < currentStep;
        const hasChanged = hasClassificationDataChanged(data);

        if (!shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        const classificationData: ProjectClassification = {
          id: originalClassificationData?.id || 0,
          jobId:
            projectClassificationJobs?.find((job) => job.id === data.jobId)
              ?.id ||
            originalClassificationData?.jobId ||
            0,
          workTypeId:
            workTypes?.find((workType) => workType.id === data.workTypeId)
              ?.id ||
            originalClassificationData?.workTypeId ||
            0,
          levelId:
            projectClassificationLevels?.find(
              (level) => level.id === data.levelId
            )?.id ||
            originalClassificationData?.levelId ||
            0,
          notes: data.notes || "",
        };

        let response: any;
        if (shouldCreate) {
          response = await projectApi.createClassificationProject(
            projectId,
            classificationData
          );
        } else {
          response = await projectApi.updateClassificationProject(
            projectId,
            classificationData
          );
        }

        if (response.success) {
          setOriginalClassificationData(classificationData);
          if (shouldCreate) {
            setCompletedSteps(currentStep);
          }

          setCurrentStep(currentStep + 1);

          return {
            success: true,
            message: "Classification saved successfully",
          };
        } else {
          console.error("API Error:", response.message);
          return { success: false, message: response.message || "API Error" };
        }
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      completedSteps,
      currentStep,
      hasClassificationDataChanged,
      originalClassificationData,
      projectClassificationJobs,
      projectClassificationLevels,
      workTypes,
      clearError,
      setLoading,
      setOriginalClassificationData,
      setCompletedSteps,
      setCurrentStep,
    ]
  );

  const submitEssentialInfo = useCallback(
    async (data: {
      title: string;
      project_type_id: number;
      city: string;
      district: string;
      location: string;
      budget: number;
      budget_unit: string;
      duration_value: number;
      duration_unit: string;
      area_sqm: number;
      description: string;
    }) => {
      // Prevent double submission
      if (isLoading) {
        console.log(
          "⚠️ Submission already in progress, ignoring duplicate call"
        );
        return {
          success: false,
          message: "Submission already in progress",
        };
      }

      try {
        clearError();
        setLoading(true);

        const shouldCreate = !projectId || completedSteps < currentStep;
        const hasChanged = hasEssentialInfoDataChanged(data);

        console.log("🔍 Essential Info Debug:", {
          projectId,
          shouldCreate,
          hasChanged,
          completedSteps,
          currentStep,
          originalData: originalEssentialInfoData,
          currentData: data,
        });

        if (projectId && !shouldCreate && !hasChanged) {
          console.log(
            "✅ Step already completed with no changes, moving to next step"
          );
          setCurrentStep(currentStep + 1);
          setLoading(false);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }
        if (projectId && !hasChanged && shouldCreate) {
          console.log(
            "✅ No changes detected, marking step as completed and moving to next step"
          );
          setCompletedSteps(currentStep);
          setCurrentStep(currentStep + 1);
          setLoading(false);
          return {
            success: true,
            message: "Step completed, navigating to next step",
          };
        }

        const essentialInfoData: ProjectEssentialInfo = {
          title: data.title,
          project_type_id:
            projectTypes?.filter((type) => type.id === data.project_type_id)[0]
              .id || 0,
          city: data.city,
          district: data.district,
          location: data.location,
          budget: data.budget,
          budget_unit: data.budget_unit,
          duration_value: data.duration_value,
          duration_unit: data.duration_unit,
          area_sqm: data.area_sqm,
          description: data.description,
        };

        let response: any;
        if (shouldCreate) {
          console.log("🚀 Making API call to create project...");
          response = await projectApi.createEssentialInfoProject(
            essentialInfoData
          );
          console.log("✅ API call completed with response:", response);
          if (response.success) {
            // Handle real API response format
            const projectData = response.data;
            const newProjectId = projectData.id || projectData.projectId;
            const newProject = projectData.project || projectData;

            if (shouldCreate) {
              const projectIdToRedirect = newProjectId;
              // Update URL without full page reload to avoid double API call
              router.replace(
                `/dashboard/individual/projects/${projectIdToRedirect}/edit`
              );
              setCompletedSteps(currentStep);
            }
            setCurrentStep(2);

            setProjectId(newProjectId);
            setProject(newProject);

            // Add the new project to the projects list
            const userProject = {
              project: newProject,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            addProject(userProject);
          } else {
            console.error("❌ Project creation failed:", response.message);
          }
        } else {
          if (!projectId) {
            setLoading(false); // Reset loading state
            return {
              success: false,
              message: "No project ID available for update",
            };
          }
          response = await projectApi.updateEssentialInfoProject(
            projectId,
            essentialInfoData
          );
          if (response.success) {
            updateProject(projectId, {
              essential_info: essentialInfoData,
            });
          }
        }
        if (response.success) {
          setOriginalEssentialInfoData(essentialInfoData);
          setLoading(false); // Reset loading state
          return {
            success: true,
            message: "Essential info saved successfully",
          };
        } else {
          console.error("API Error:", response.message);
          const errorMessage =
            response.message || "Failed to save essential info";
          setLoading(false); // Reset loading state
          return { success: false, message: errorMessage };
        }
      } catch (error) {
        console.error("❌ Error:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        return {
          success: false,
          message: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      setProjectId,
      completedSteps,
      currentStep,
      hasEssentialInfoDataChanged,
      originalEssentialInfoData,
      projectTypes,
      clearError,
      setLoading,
      setOriginalEssentialInfoData,
      setCompletedSteps,
      setCurrentStep,
    ]
  );

  const uploadFile = useCallback(
    async (file: File, collection: string, projectId: string) => {
      const fileId = `file_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      try {
        // Create document file object
        const documentFile: DocumentFile = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadStatus: "uploading",
          uploadProgress: 0,
        };

        // Add to store immediately with pending status
        addDocumentFile(collection as keyof DocumentsState, documentFile);

        // Upload the file
        const response = await projectApi.uploadFile(
          projectId,
          file,
          collection
        );

        if (response.success) {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            uploadStatus: "completed",
            uploadProgress: 100,
            url: response.data.url,
          });
          return {
            success: true,
            message: "File uploaded successfully",
            fileId,
          };
        } else {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            uploadStatus: "error",
            error: response.message,
          });
          return { success: false, message: response.message };
        }
      } catch (error) {
        updateDocumentFile(collection as keyof DocumentsState, fileId, {
          uploadStatus: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        });
        return {
          success: false,
          message: error instanceof Error ? error.message : "Upload failed",
        };
      }
    },
    [addDocumentFile, updateDocumentFile]
  );

  const removeFile = useCallback(
    async (fileId: string, collection: string, projectId: string) => {
      try {
        const response = await projectApi.removeFile(
          projectId,
          fileId,
          collection
        );

        if (response.success) {
          // Only remove from local state after successful API call
          removeDocumentFile(collection as keyof DocumentsState, fileId);
          return { success: true, message: "File removed successfully" };
        } else {
          return {
            success: false,
            message: response.message || "Failed to remove file from server",
          };
        }
      } catch (error) {
        console.error("API Error removing file:", error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Network error occurred",
        };
      }
    },
    [removeDocumentFile]
  );

  const removeFileLocal = useCallback(
    (fileId: string, collection: string) => {
      removeDocumentFile(collection as keyof DocumentsState, fileId);
      return { success: true, message: "File removed from local state" };
    },
    [removeDocumentFile]
  );

  const reuploadFile = useCallback(
    async (
      fileId: string,
      newFile: File,
      collection: string,
      projectId: string
    ) => {
      try {
        // Update file status to uploading
        updateDocumentFile(collection as keyof DocumentsState, fileId, {
          uploadStatus: "uploading",
          uploadProgress: 0,
          error: undefined,
        });

        const response = await projectApi.reuploadFile(
          projectId,
          fileId,
          newFile,
          collection
        );

        if (response.success) {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            file: newFile,
            name: newFile.name,
            size: newFile.size,
            type: newFile.type,
            uploadStatus: "completed",
            uploadProgress: 100,
            url: response.data.url,
          });
          return { success: true, message: "File reuploaded successfully" };
        } else {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            uploadStatus: "error",
            error: response.message,
          });
          return { success: false, message: response.message };
        }
      } catch (error) {
        updateDocumentFile(collection as keyof DocumentsState, fileId, {
          uploadStatus: "error",
          error: error instanceof Error ? error.message : "Reupload failed",
        });
        return {
          success: false,
          message: error instanceof Error ? error.message : "Reupload failed",
        };
      }
    },
    [updateDocumentFile]
  );

  const submitDocuments = useCallback(
    async (data: {
      architectural_plans: File[];
      licenses: File[];
      specifications: File[];
      site_photos: File[];
    }) => {
      try {
        clearError();
        setLoading(true);
        console.log("🔍 Documents Debug:", {
          projectId,
          completedSteps,
          currentStep,
          documentsData: data,
        });
        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }
        if (completedSteps < currentStep) setCompletedSteps(currentStep);
        if (currentStep < 4) setCurrentStep(currentStep + 1);
        console.log("Documents step completed successfully", currentStep);
        return {
          success: true,
          message: "Documents step completed successfully",
        };
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      completedSteps,
      currentStep,
      clearError,
      setLoading,
      setCompletedSteps,
      setCurrentStep,
    ]
  );

  const submitBOQ = useCallback(
    async (data: {
      items: Array<{
        name: string;
        description: string;
        unit_id: number;
        quantity: number;
        unit_price: number;
        sort_order: number;
        is_required: boolean;
      }>;
      total_amount: number;
      template_id?: number;
    }) => {
      try {
        clearError();
        setLoading(true);

        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }

        console.log("🔍 BOQ Debug:", {
          projectId,
          boqData: data,
          completedSteps: completedSteps,
          currentStep: currentStep,
        });

        // Here you would typically make an API call to save the BOQ data
        // For now, we'll just simulate success
        const shouldCreate = completedSteps < currentStep;
        const hasChanged = hasBOQDataChanged(data);

        let response: any;
        if (!shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          console.log("No changes detected, navigating to next step");
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (shouldCreate) {
          setCompletedSteps(currentStep);
          // Set original data for change detection
          setOriginalBOQData(data);
          response = await projectApi.createBOQProject(projectId, data);
          if (response.success) {
            setCompletedSteps(currentStep);
            setOriginalBOQData(data);
            setCurrentStep(currentStep + 1);
            return {
              success: true,
              message: "BOQ saved successfully",
            };
            // Note: loadAllProjectData will be called by the forms when they detect the new projectId
          }
        } else {
          response = await projectApi.updateBOQProject(projectId, data);
          if (response.success) {
            setOriginalBOQData(data);
            setCurrentStep(currentStep + 1);
            return {
              success: true,
              message: "BOQ saved successfully",
            };
          }
        }

        return {
          success: false,
          message: response.message || "Failed to save BOQ",
        };
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      completedSteps,
      currentStep,
      clearError,
      setLoading,
      setCompletedSteps,
      setCurrentStep,
      hasBOQDataChanged,
    ]
  );
  const submitPublishSettings = useCallback(
    async (data: {
      notify_matching_contractors: boolean;
      notify_client_on_offer: boolean;
      offers_window_days: number;
    }) => {
      try {
        clearError();
        setLoading(true);

        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }
        const shouldCreate = completedSteps < currentStep;
        const hasChanged = hasPublishSettingsChanged(data);

        console.log("🔍 Publish Settings Debug:", {
          projectId,
          shouldCreate,
          hasChanged,
          completedSteps,
          currentStep,
        });

        if (projectId && !shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }
        const publishSettingsData: PublishSettings = {
          notify_matching_contractors: data.notify_matching_contractors,
          notify_client_on_offer: data.notify_client_on_offer,
          offers_window_days: data.offers_window_days,
        };
        let response: any;
        response = await projectApi.handlePublishSettingsProject(
          projectId,
          publishSettingsData
        );
        if (response.success) {
          setPublishSettings(publishSettingsData);
          setCompletedSteps(currentStep);
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "Publish Settings step completed successfully",
          };
        } else {
          return {
            success: false,
            message: response.message || "Failed to save publish settings",
          };
        }
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      clearError,
      setLoading,
      setCompletedSteps,
      setCurrentStep,
      setPublishSettings,
      hasPublishSettingsChanged,
      projectId,
      completedSteps,
      currentStep,
      setPublishSettings,
    ]
  );

  const submitSendProjectToReview = useCallback(async () => {
    try {
      clearError();
      setLoading(true);
      if (!projectId) {
        return {
          success: false,
          message: "No project ID available",
        };
      }
      const newProject: Project = {
        id: projectId,
        essential_info: originalEssentialInfoData as ProjectEssentialInfo,
        classification: originalClassificationData as ProjectClassification,
        documents: documents as DocumentsState,
        status: projectStatus as ProjectStatus,
        publish_settings: publishSettings as PublishSettings,
        boq: boqData as BOQData,
      };

      const response = await projectApi.handleSendProjectToReview(projectId);
      if ((response as any).success) {
        setProjectStatus({ status: "pending_review" });
        updateProject(projectId, { status: { status: "pending_review" } });

        // Complete the project creation flow
        console.log("Project sent to review successfully :", newProject);
        setProjects([
          ...projects,
          {
            project: newProject,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
        setCompletedSteps(currentStep);

        // Reset the project creation state for next project
        resetProjectCreation();

        return {
          success: true,
          message: "Project sent to review successfully",
        };
      }

      return {
        success: false,
        message:
          (response as any).message || "Failed to send project to review",
      };
    } catch (error) {
      console.error("❌ Error:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      };
    } finally {
      setLoading(false);
    }
  }, [
    projectId,
    clearError,
    setLoading,
    setProjectStatus,
    updateProject,
    setCompletedSteps,
    currentStep,
    resetProjectCreation,
  ]);

  const getCurrentProject = useCallback(() => {
    return project;
  }, [project]);

  const isProjectComplete = useCallback(() => {
    return isProjectCreationComplete();
  }, [isProjectCreationComplete]);

  return {
    error,
    loading: isLoading,
    project,
    projectId,
    currentStep,
    completedSteps,
    isProjectComplete,
    getCurrentProject,
    submitClassification,
    submitEssentialInfo,
    submitDocuments,
    submitBOQ,
    submitPublishSettings,
    uploadFile,
    removeFile,
    removeFileLocal,
    reuploadFile,
    documents,
    publishSettings,
    submitSendProjectToReview,
    resetProjectCreation,
  };
};
