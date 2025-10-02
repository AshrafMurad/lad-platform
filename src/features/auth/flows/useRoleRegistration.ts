import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import {
  AuthUser,
  PersonalInfo,
  RoleSpecificData,
  DynamicRegistrationData,
} from "@auth/types/auth";
import { authApi } from "@auth/services/authApi";
import { createValidationSchemas } from "@auth/utils/validation";
import { useTranslations } from "next-intl";
import { tokenStorage } from "@auth/utils/tokenStorage";
import { useRouter } from "next/navigation";

export const useRoleRegistration = () => {
  const store = useAuthStore();
  const router = useRouter();
  const t = useTranslations();

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (store.canGoToNextStep()) {
      store.goToNextStep();
    }
  }, [store]);

  const goToPreviousStep = useCallback(() => {
    if (store.canGoToPreviousStep()) {
      store.goToPreviousStep();
    }
  }, [store]);

  const goToStep = useCallback(
    (step: string) => {
      store.setCurrentStep(step);
    },
    [store]
  );

  // Auth method handlers
  const handleAuthMethodSelect = useCallback(
    (method: "email" | "phone" | "thirdParty") => {
      store.setAuthMethod(method);
      // Only advance immediately for email/phone. For thirdParty, wait until
      // the OAuth flow returns successfully, then advance inside the Google hook.
      if (method === "email" || method === "phone") {
        store.goToNextStep();
      }
    },
    [store]
  );

  // Schema getter - returns the appropriate schema based on role
  const getPersonalInfoSchema = useCallback(
    (role: string) => {
      const validationSchemas = createValidationSchemas(t);

      switch (role) {
        case "individual":
          return validationSchemas.individualRegistrationSchema;
        case "supplier":
          return validationSchemas.supplierRegistrationSchema;
        case "engineering_office":
          return validationSchemas.engineeringOfficeRegistrationSchema;
        case "freelance_engineer":
          return validationSchemas.freelanceEngineerRegistrationSchema;
        case "contractor":
          return validationSchemas.contractorRegistrationSchema;
        case "organization":
          return validationSchemas.organizationRegistrationSchema;
        case "governmental":
          return validationSchemas.governmentalRegistrationSchema;
        default:
          return validationSchemas.baseRegistrationSchema;
      }
    },
    [t]
  );

  // Unified form submission handler
  const handlePersonalInfoSubmit = useCallback(
    async (data: PersonalInfo, role: string) => {
      try {
        store.setLoading(true);
        store.clearError();

        // Prepare data based on role
        const registrationData: DynamicRegistrationData = {
          name: data.name!,
          email: data.email!,
          password: data.password!,
          password_confirmation: data.password!,
          phone: data.phone!,
          country_id: data.country_id || "SA", // Default to Saudi Arabia
        };

        // Add role-specific fields
        if (role === "individual") {
          registrationData.national_id = data.national_id || "";
        } else if (role === "supplier") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "contractor") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "engineering_office") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.license_number = data.license_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "freelance_engineer") {
          registrationData.engineers_association_number =
            data.engineers_association_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "organization") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "governmental") {
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
        }

        let registrationResult = await authApi.register(
          {
            userType: store.currentRole!,
            role: store.currentRole!,
            authMethod: store.authMethod!,
            data: registrationData,
          },
          role
        );

        if (registrationResult.success) {
          // Store tokens and user data
          if (
            registrationResult.data?.response.extra.tokens &&
            registrationResult.data?.response
          ) {
            tokenStorage.storeTokens(
              registrationResult.data.response.extra.tokens,
              registrationResult.data.response as any
            );
          }
          if (registrationResult.data?.response) {
            store.setUserData(
              registrationResult.data.response as unknown as AuthUser
            );
          }

          if (
            registrationResult.data?.response.account_overview
              .verification_required.email_verification.has_token
          ) {
            store.setAuthMethod("email");
            store.goToNextStep();
            return { success: true };
          } else if (
            registrationResult.data?.response.account_overview
              .verification_required.phone_verification.has_token
          ) {
            store.setAuthMethod("phone");
            store.goToNextStep();
            return { success: true };
          } else {
            router.push("/dashboard");
            return { success: true };
          }
          // Check if verification is required
        } else {
          // Handle backend validation errors
          if (
            registrationResult.errors &&
            Object.keys(registrationResult.errors).length > 0
          ) {
            // Extract field-specific errors
            const fieldErrors = Object.entries(registrationResult.errors)
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`
              )
              .join("; ");

            throw new Error(
              fieldErrors || registrationResult.message || "Registration failed"
            );
          }

          throw new Error(registrationResult.message || "Registration failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit personal info";

        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // Verification handlers
  const handleVerificationSubmit = useCallback(
    async (code: string) => {
      try {
        store.setLoading(true);
        store.clearError();

        const userFromStorage = tokenStorage.getUser();
        const emailFromStore =
          (store.roleData as RoleSpecificData).personalInfo?.email ||
          (store.roleData as RoleSpecificData).thirdPartyInfo?.email ||
          (store.roleData as RoleSpecificData).thirdPartyInfo?.email;
        const phoneFromStore = (store.roleData as RoleSpecificData).phoneInfo
          ?.phoneNumber;
        const contactInfo =
          store.authMethod === "phone"
            ? phoneFromStore || userFromStorage?.phone
            : emailFromStore || userFromStorage?.email;
        if (!contactInfo) {
          throw new Error(
            "Contact information not available for verification."
          );
        }
        if (store.authMethod === "email") {
          const verificationResult = await authApi.verifyEmail({
            email: contactInfo as string,
            token: code,
          });

          if (
            verificationResult.success &&
            verificationResult.data?.isVerified
          ) {
            store.setIsVerified(true);
            // Don't change the step - let useRoleRedirect handle the redirect
            return { success: true };
          } else {
            throw new Error(
              verificationResult.message || "Invalid verification code"
            );
          }
        } else {
          const verificationResult = await authApi.verifyPhone({
            phoneNumber: contactInfo as string,
            token: code,
          });

          if (
            verificationResult.success &&
            verificationResult.data?.isVerified
          ) {
            store.setIsVerified(true);
            // Don't change the step - let useRoleRedirect handle the redirect
            return { success: true };
          } else {
            throw new Error(
              verificationResult.message || "Invalid verification code"
            );
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Verification failed";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const handleResendCode = useCallback(async () => {
    try {
      store.setLoading(true);
      store.clearError();

      const userFromStorage = tokenStorage.getUser();
      const emailFromStore =
        (store.roleData as RoleSpecificData).personalInfo?.email ||
        (store.roleData as RoleSpecificData).thirdPartyInfo?.email;
      const phoneFromStore = (store.roleData as RoleSpecificData).phoneInfo
        ?.phoneNumber;
      const contactInfo =
        store.authMethod === "phone"
          ? phoneFromStore || userFromStorage?.phone
          : emailFromStore || userFromStorage?.email;
      if (!contactInfo) {
        throw new Error("Contact information not available to resend code.");
      }

      if (store.authMethod === "phone") {
        const resendResult = await authApi.sendPhoneOtp(contactInfo as string);
        if (resendResult.success) {
          return { success: true };
        } else {
          throw new Error(resendResult.message || "Failed to resend code");
        }
      } else {
        const resendResult = await authApi.resendEmailVerification();
        if (resendResult.success) {
          return { success: true };
        } else {
          throw new Error(resendResult.message || "Failed to resend code");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend code";
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const handleResendEmailVerification = useCallback(async () => {
    try {
      store.setLoading(true);
      store.clearError();

      const resendResult = await authApi.resendEmailVerification();

      if (resendResult.success) {
        return { success: true };
      } else {
        throw new Error(
          resendResult.message || "Failed to resend email verification"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend email verification";
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Completion handler
  const handleComplete = useCallback(() => {
    store.resetRegistration();
    // Typically you would redirect the user here, e.g.:
    // router.push("/dashboard");
  }, [store]);

  // Utility functions
  const getStepProgress = useCallback(() => {
    const stepInfo = store.getCurrentStepInfo();
    return {
      currentStep: stepInfo.stepNumber,
      totalSteps: stepInfo.totalSteps,
      progress: stepInfo.progress,
    };
  }, [store]);

  const getStepTitle = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Individual Registration";
  }, []);

  const getStepDescription = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Complete your individual registration";
  }, []);

  return {
    ...store,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleAuthMethodSelect,
    getPersonalInfoSchema,
    handlePersonalInfoSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleResendEmailVerification,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
  };
};

export default useRoleRegistration;
