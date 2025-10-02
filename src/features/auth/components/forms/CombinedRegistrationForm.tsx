"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { Input } from "@shared/components/ui/input";
import { Checkbox } from "@shared/components/ui/checkbox";
import GoogleAuthButton from "@auth/components/common/GoogleAuthButton";
import AppleAuthButton from "@auth/components/common/AppleAuthButton";

import { useRoleRegistration } from "@auth/flows/useRoleRegistration";
import { useAuthStore } from "@auth/store/authStore";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleAuth } from "@/features/auth/hooks";

import Link from "next/link";
import z from "zod";
import {
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from "../../utils/getPasswordStrength";
import { useTranslations } from "next-intl";
import { createValidationSchemas } from "@auth/utils/validation";
import { RegistrationRole } from "@auth/types/auth";
import { FileUpload } from "@/features/auth/components/file-upload";
import { DynamicFormData } from "@/features/auth/types/auth";

const CombinedRegistrationForm: React.FC<{ role: string }> = ({ role }) => {
  const store = useAuthStore();
  const { handlePersonalInfoSubmit } = useRoleRegistration();
  const { signInWithGoogle, lastResult, clearLastResult } = useGoogleAuth();
  const t = useTranslations("");
  const commonT = useTranslations("common");
  const authT = useTranslations("auth");
  const isLoading = store.isLoading;

  // State to track if user has clicked social login
  const [hasClickedSocialLogin, setHasClickedSocialLogin] =
    React.useState(false);
  const [socialProvider, setSocialProvider] = React.useState<string | null>(
    null
  );

  const onSubmit = handlePersonalInfoSubmit;
  const {
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
  } = store;

  // Get the appropriate validation schema based on role
  const validationSchemas = createValidationSchemas(t);
  const getSchemaForRole = (role: string) => {
    switch (role as RegistrationRole) {
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
      default:
        return validationSchemas.baseRegistrationSchema;
    }
  };

  const schema = getSchemaForRole(role);

  const form = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onBlur", // Enable real-time validation
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      country_id: "",
      // Role-specific fields
      ...(role === "individual" && { national_id: "" }),
      ...(role === "supplier" && {
        business_name: "",
        commercial_register_number: "",
        commercial_register_file: undefined,
      }),
      ...(role === "engineering_office" && {
        business_name: "",
        license_number: "",
        commercial_register_number: "",
        commercial_register_file: undefined,
      }),
      ...(role === "freelance_engineer" && {
        engineers_association_number: "",
        commercial_register_file: undefined,
      }),
      ...(role === "contractor" && {
        business_name: "",
        commercial_register_number: "",
        commercial_register_file: undefined,
      }),
      ...(role === "organization" && {
        business_name: "",
        commercial_register_number: "",
        commercial_register_file: undefined,
      }),
    },
    shouldUnregister: true,
  });
  React.useEffect(() => {
    if (store.roleData.thirdPartyInfo) {
      const thirdPartyInfo = store.roleData.thirdPartyInfo;
      // Combine firstName and lastName into name field
      if (thirdPartyInfo.firstName || thirdPartyInfo.lastName) {
        const fullName = `${thirdPartyInfo.firstName || ""} ${
          thirdPartyInfo.lastName || ""
        }`.trim();
        form.setValue("name", fullName);
      }
      if (thirdPartyInfo.email) {
        form.setValue("email", thirdPartyInfo.email);
      }
    }
  }, [store.roleData.thirdPartyInfo, form]);

  // Clear errors when user starts typing
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && store.error) {
        store.clearError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, store]);

  const handleSubmit = async (values: any) => {
    store.clearError();

    store.setAuthMethod("email");

    const result = await onSubmit(values, role);

    if (!result.success) {
      // Error handling is done in the onSubmit function
    }
  };

  const handleGoogleSignUp = () => {
    // Set auth method to third party first
    store.setAuthMethod("thirdParty");

    clearLastResult();

    // Start the Google OAuth flow
    signInWithGoogle();
  };

  // Handle the result when it becomes available
  React.useEffect(() => {
    if (lastResult) {
      if (lastResult.success && lastResult.profile) {
        // Store the third-party info in the store
        store.setRoleData("thirdPartyInfo", {
          firstName: lastResult.profile.firstName || "",
          lastName: lastResult.profile.lastName || "",
          email: lastResult.profile.email || "",
          provider: "google",
        });

        // Go to social login form step
        store.setCurrentStep("socialLoginForm");

        // Clear the result
        clearLastResult();
      } else if (lastResult.error) {
        store.setError(lastResult.error);
      }
    }
  }, [lastResult, store, clearLastResult]);

  const handleAppleSignUp = () => {
    // Mock Apple OAuth for development
    // In a real app, this would initiate Apple OAuth similar to Google
    const mockAppleData = {
      firstName: "Apple",
      lastName: "User",
      email: "apple.user@privaterelay.appleid.com",
      provider: "apple",
    };

    // Store the third-party info in the store
    store.setRoleData("thirdPartyInfo", mockAppleData);
    store.setAuthMethod("thirdParty");

    // Go to social login form step
    store.setCurrentStep("socialLoginForm");
  };

  const passwordStrength = getPasswordStrength(form.watch("password") || "");

  return (
    <div className="flex-center">
      <Card className="container-narrow bg-transparent border-none shadow-none">
        <CardContent>
          <div className="space-y-6">
            {/* Registration Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="form-section"
              >
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{authT("personalInfo.fullName")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{authT("personalInfo.email")} </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          disabled={isLoading}
                          dir="ltr"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {authT("personalInfo.phoneNumber")}{" "}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="050 000 0000"
                          disabled={isLoading}
                          value={
                            field.value
                              ? field.value.replace(
                                  /(\d{3})(\d{3})(\d{4})/,
                                  "$1 $2 $3"
                                )
                              : ""
                          }
                          onChange={(e) => {
                            // Format phone number as user types
                            let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
                            if (value.startsWith("966")) {
                              value = value.substring(3); // Remove 966 prefix if user types it
                            }
                            if (value.length > 10) {
                              value = value.substring(0, 10); // Limit to 10 digits
                            }
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Passwords */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{authT("personalInfo.password")} </FormLabel>
                      <FormControl>
                        <div className="input-password-container">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            disabled={isLoading}
                            dir="ltr"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="input-password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="icon-sm" />
                            ) : (
                              <Eye className="icon-sm" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <div
                        className={`text-xs ${getPasswordStrengthColor(
                          passwordStrength
                        )}`}
                      >
                        {getPasswordStrengthText(passwordStrength, t)}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {authT("personalInfo.confirmPassword")}{" "}
                      </FormLabel>
                      <FormControl>
                        <div className="input-password-container">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            {...field}
                            disabled={isLoading}
                            dir="ltr"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="input-password-toggle"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="icon-sm" />
                            ) : (
                              <Eye className="icon-sm" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Role-specific fields */}
                {role === "individual" && (
                  <FormField
                    control={form.control}
                    name="national_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {authT("personalInfo.nationalId")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(role === "supplier" ||
                  role === "contractor" ||
                  role === "organization") && (
                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {authT("personalInfo.businessName")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {(role === "supplier" ||
                  role === "contractor" ||
                  role === "organization") && (
                  <FormField
                    control={form.control}
                    name="commercial_register_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {authT("personalInfo.commercialRegisterNumber")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "supplier" && (
                  <FormField
                    control={form.control}
                    name="commercial_register_file"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            value={value}
                            onChange={onChange}
                            disabled={isLoading}
                            label={authT("personalInfo.commercialRegisterFile")}
                            placeholder={authT(
                              "personalInfo.commercialRegisterFile"
                            )}
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            maxSizeMB={8}
                            id="commercial-register-file-upload-supplier"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "contractor" && (
                  <FormField
                    control={form.control}
                    name="commercial_register_file"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            value={value}
                            onChange={onChange}
                            disabled={isLoading}
                            label={authT("personalInfo.commercialRegisterFile")}
                            placeholder={authT(
                              "personalInfo.commercialRegisterFile"
                            )}
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            maxSizeMB={8}
                            id="commercial-register-file-upload-contractor"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "organization" && (
                  <FormField
                    control={form.control}
                    name="commercial_register_file"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            value={value}
                            onChange={onChange}
                            disabled={isLoading}
                            label={authT("personalInfo.commercialRegisterFile")}
                            placeholder={authT(
                              "personalInfo.commercialRegisterFile"
                            )}
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            maxSizeMB={8}
                            id="commercial-register-file-upload"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {role === "engineering_office" && (
                  <>
                    <FormField
                      control={form.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {authT("personalInfo.businessName")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="license_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {authT("personalInfo.licenseNumber")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="commercial_register_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {authT("personalInfo.commercialRegisterNumber")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="commercial_register_file"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              value={value}
                              onChange={onChange}
                              disabled={isLoading}
                              label={authT(
                                "personalInfo.commercialRegisterFile"
                              )}
                              placeholder={authT(
                                "personalInfo.commercialRegisterFile"
                              )}
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              maxSizeMB={8}
                              id="commercial-register-file-upload-engineering"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {role === "freelance_engineer" && (
                  <>
                    <FormField
                      control={form.control}
                      name="engineers_association_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {authT("personalInfo.engineersAssociationNumber")}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="commercial_register_file"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <FileUpload
                              value={value}
                              onChange={onChange}
                              disabled={isLoading}
                              label={authT(
                                "personalInfo.commercialRegisterFile"
                              )}
                              placeholder={authT(
                                "personalInfo.commercialRegisterFile"
                              )}
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              maxSizeMB={8}
                              id="commercial-register-file-upload-freelance"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Terms and Privacy - Note: Terms validation is handled separately */}
                <div className="flex flex-row items-start space-x-3 space-y-0">
                  <Checkbox checked={true} disabled={isLoading} />
                  <div className="form-checkbox-content">
                    <FormLabel className="flex flex-wrap">
                      <span>
                        {authT("terms.text")}{" "}
                        <Link href="#" className="link-muted">
                          {authT("terms.termsLink")}
                        </Link>{" "}
                        {authT("terms.and")}{" "}
                        <Link href="#" className="link-alt">
                          {authT("terms.privacyLink")}
                        </Link>
                      </span>
                    </FormLabel>
                  </div>
                </div>

                {/* Error Display */}
                {store.error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{store.error}</p>
                  </div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="btn-full-width"
                  disabled={isLoading}
                >
                  {isLoading
                    ? commonT("actions.loading")
                    : authT("personalInfo.continue")}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            {role === "individual" && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      {authT("roleSelection.or")}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <GoogleAuthButton handleGoogleSignUp={handleGoogleSignUp} />
                  <AppleAuthButton handleAppleSignUp={handleAppleSignUp} />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CombinedRegistrationForm;
