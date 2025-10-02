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

import { useRoleRegistration } from "@auth/flows/useRoleRegistration";
import { useAuthStore } from "@auth/store/authStore";
import { useGoogleAuth } from "@/features/auth/hooks";
import { createValidationSchemas } from "@auth/utils/validation";
import { RegistrationRole } from "@auth/types/auth";
import { DynamicFormData } from "@/features/auth/types/auth";

import Link from "next/link";
import z from "zod";
import { useTranslations } from "next-intl";
import { Eye, EyeOff } from "lucide-react";
import {
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from "../../utils/getPasswordStrength";

const SocialLoginForm: React.FC<{ provider: string }> = ({ provider }) => {
  const role = "individual"; // Social login is only for individual users
  const store = useAuthStore();
  const { handlePersonalInfoSubmit } = useRoleRegistration();
  const t = useTranslations("");
  const commonT = useTranslations("common");
  const authT = useTranslations("auth");
  const isLoading = store.isLoading;

  const onSubmit = handlePersonalInfoSubmit;

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
      national_id: "", // Only individual fields
    },
    shouldUnregister: true,
  });

  // Pre-fill form with third-party data when component mounts
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

    const result = await onSubmit(values, role);

    if (result.success) {
      // For social login, manually advance to verification step
      store.setCurrentStep("verification");
    }
  };

  return (
    <div className="flex-center">
      <Card className="container-narrow bg-transparent border-none shadow-none">
        <CardContent>
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
                    <FormLabel>{authT("personalInfo.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={true}
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
                    <FormLabel>{authT("personalInfo.phoneNumber")}</FormLabel>
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authT("personalInfo.password")}</FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          type={store.showPassword ? "text" : "password"}
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
                            store.setShowPassword(!store.showPassword)
                          }
                          disabled={isLoading}
                        >
                          {store.showPassword ? (
                            <EyeOff className="icon-sm" />
                          ) : (
                            <Eye className="icon-sm" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <div
                      className={`text-xs ${getPasswordStrengthColor(
                        getPasswordStrength(field.value || "")
                      )}`}
                    >
                      {getPasswordStrengthText(
                        getPasswordStrength(field.value || ""),
                        t
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {authT("personalInfo.confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          type={store.showConfirmPassword ? "text" : "password"}
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
                            store.setShowConfirmPassword(
                              !store.showConfirmPassword
                            )
                          }
                          disabled={isLoading}
                        >
                          {store.showConfirmPassword ? (
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

              {/* National ID - Individual only */}
              <FormField
                control={form.control}
                name="national_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authT("personalInfo.nationalId")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder={authT(
                          "personalInfo.nationalIdPlaceholder"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialLoginForm;
