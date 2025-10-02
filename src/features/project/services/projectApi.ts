import { api } from "@/lib/api";
import {
  BOQData,
  ProjectClassification,
  DocumentsState,
  ProjectEssentialInfo,
  PublishSettings,
} from "../types/project";

export const projectApi = {
  getProject: async (projectId: string) => {
    try {
      const response = await api.get(`/projects/owner/${projectId}`);
      return response.data;
    } catch (error) {
      console.log("Error getting project:", error);
      return {
        success: false,
        message: "Error getting project",
        data: null,
      };
    }
  },
  getProjectTypes: async () => {
    try {
      const response = await api.get("general-data-profile/project-types");

      return response.data;
    } catch (error) {
      console.log("Error getting project types:", error);
      return {
        success: false,
        message: "Error getting project types",
        data: null,
      };
    }
  },
  getWorkTypes: async () => {
    try {
      const response = await api.get("general-data-profile/work-types");
      return response.data;
    } catch (error) {
      console.log("Error getting work types:", error);
      return {
        success: false,
        message: "Error getting work types",
        data: null,
      };
    }
  },
  getProjectClassificationJobs: async () => {
    try {
      const response = await api.get(
        "/general-data-profile/classification-jobs"
      );
      return response.data;
    } catch (error) {
      console.log("Error getting project classification jobs:", error);
      return {
        success: false,
        message: "Error getting project classification jobs",
        data: null,
      };
    }
  },

  getProjectClassificationLevels: async () => {
    try {
      const response = await api.get(
        "/general-data-profile/classification-levels"
      );
      return response.data;
    } catch (error) {
      console.log("Error getting project classifications:", error);
      return {
        success: false,
        message: "Error getting project classifications",
        data: null,
      };
    }
  },

  createEssentialInfoProject: async (data: ProjectEssentialInfo) => {
    try {
      console.log("🚀 Creating project with data:", data);

      const response = await api.post("/projects/owner", data);

      console.log("✅ Project creation response:", response.data);

      return {
        success: true,
        message: "Project created successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("❌ Error creating project:", error);

      // Handle different error response formats
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create project";

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },
  updateEssentialInfoProject: async (
    projectId: string,
    data: ProjectEssentialInfo
  ) => {
    try {
      console.log("🔄 Updating project essential info:", { projectId, data });

      const response = await api.put(`/projects/owner/${projectId}`, data);

      console.log("✅ Essential info update response:", response.data);

      return {
        success: true,
        message: "Essential info updated successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("❌ Error updating project essential info:", error);

      // Handle different error response formats
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update essential info";

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },
  createClassificationProject: async (
    projectId: string,
    data: ProjectClassification
  ) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Classification created successfully",
            data: {
              projectId,
              classification: data,
            },
          });
        }, 1500);
      });

      return response;
    } catch (error) {
      console.error("Error creating project classification:", error);
      return {
        success: false,
        message: "Failed to create classification",
        data: null,
      };
    }
  },
  updateClassificationProject: async (
    projectId: string,
    data: ProjectClassification
  ) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Classification updated successfully",
            data: {
              projectId,
              classification: data,
            },
          });
        }, 1500);
      });

      return response;
    } catch (error) {
      console.error("Error updating project classification:", error);
      return {
        success: false,
        message: "Failed to update classification",
        data: null,
      };
    }
  },
  updateDocumentsProject: async (projectId: string, data: DocumentsState) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Fake project created successfully",
            data: {
              ...data,
              id: Date.now(), // mock ID
            },
          });
        }, 3000); // 3 seconds
      });

      return response;
    } catch (error) {
      console.error("Error updating project documents:", error);
      throw error;
    }
  },
  createDocumentsProject: async (projectId: string, data: DocumentsState) => {
    try {
      const response = await api.post(
        `/projects/owner/${projectId}/documents`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating project documents:", error);
      throw error;
    }
  },

  // Fake API methods for file operations
  uploadFile: async (projectId: string, file: File, collection: string) => {
    try {
      //   const response = await api.post(
      //     `/projects/owner/${projectId}/files/upload-single`,
      //     {
      //       file,
      //       collection: collection,
      //     }
      //   );
      //   return response.data;
      return new Promise<{ success: boolean; data: any; message: string }>(
        (resolve) => {
          const interval = setInterval(() => {
            clearInterval(interval);
            // Simulate successful upload
            resolve({
              success: true,
              data: {
                fileId: `file_${projectId}_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                collection: collection,
                url: `https://fake-cdn.com/uploads/${collection}/${file.name}`,
              },
              message: "File uploaded successfully",
            });
          }, 2000); // Simulate 2 second upload delay
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        data: null,
        message: "Error uploading file",
      };
    }
  },

  removeFile: async (projectId: string, fileId: string, collection: string) => {
    try {
      // return new Promise<{ success: boolean; message: string }>((resolve) => {
      //   setTimeout(() => {
      //     resolve({
      //       success: true,
      //       message: "File removed successfully",
      //     });
      //   }, 1000); // Simulate API delay
      // });
      const response = await api.delete(
        `/projects/owner/${projectId}/files/${fileId}`,
        {
          data: {
            collection,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error removing file:", error);
      return {
        success: false,
        message: "Error removing file",
      };
    }
  },

  reuploadFile: async (
    projectId: string,
    fileId: string,
    newFile: File,
    collection: string
  ) => {
    try {
      const response = await api.post(
        `/projects/owner/${projectId}/files/upload-single`,
        {
          file: newFile,
          collection: collection,
        }
      );
      return response.data;
      // return new Promise<{ success: boolean; data: any; message: string }>(
      //   (resolve) => {
      //     const interval = setInterval(() => {
      //       clearInterval(interval);
      //       // Simulate successful reupload
      //       resolve({
      //         success: true,
      //         data: {
      //           fileId: fileId, // Keep same ID for reupload
      //           fileName: newFile.name,
      //           fileSize: newFile.size,
      //           fileType: newFile.type,
      //           collection: collection,
      //           url: `https://fake-cdn.com/uploads/${collection}/${
      //             newFile.name
      //           }?updated=${Date.now()}`,
      //         },
      //         message: "File reuploaded successfully",
      //       });
      //     }, 1500); // Slightly faster for reupload (1.5 seconds)
      //   }
      // );
    } catch (error) {
      console.error("Error reuploading file:", error);
      return {
        success: false,
        data: null,
        message: "Error reuploading file",
      };
    }
  },
  createBOQProject: async (projectId: string, data: BOQData) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "BOQ created successfully",
            data: {
              projectId,
              boq: data,
            },
          });
        }, 1500);
      });

      return response;
    } catch (error) {
      console.error("Error creating BOQ project:", error);
      return {
        success: false,
        message: "Failed to create BOQ",
        data: null,
      };
    }
  },
  updateBOQProject: async (projectId: string, data: BOQData) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "BOQ updated successfully",
            data: {
              projectId,
              boq: data,
            },
          });
        }, 1500);
      });

      return response;
    } catch (error) {
      console.error("Error updating BOQ project:", error);
      return {
        success: false,
        message: "Failed to update BOQ",
        data: null,
      };
    }
  },
  handlePublishSettingsProject: async (
    projectId: string,
    data: PublishSettings
  ) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Publish settings saved successfully",
            data: {
              ...data,
              projectId,
              publish_settings: data,
            },
          });
        }, 1500);
      });

      return response;
    } catch (error) {
      console.error("Error handling publish settings:", error);
      return {
        success: false,
        message: "Failed to save publish settings",
        data: null,
      };
    }
  },
  handleSendProjectToReview: async (projectId: string) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Project sent to review successfully",
            data: {
              projectId,
              project: {
                id: projectId,
                status: { status: "pending_review" },
              },
            },
          });
        }, 2000);
      });

      return response;
    } catch (error) {
      console.error("Error sending project to review:", error);
      return {
        success: false,
        message: "Failed to send project to review",
        data: null,
      };
    }
  },
};
