import { Country, Value } from "react-phone-number-input";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  userType: UserType;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  userType: UserType;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface PasswordResetData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export enum UserRole {
  INDIVIDUAL = "individual",
  CONTRACTOR = "contractor",
  ENGINEERING_OFFICE = "engineering_office",
  FREELANCE_ENGINEER = "freelance_engineer",
  ORGANIZATION = "organization",
}

export enum UserType {
  PERSONAL = "personal",
  BUSINESS = "business",
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}
// features/authentication/types/auth.ts

// الأدوار المتاحة
export type RegistrationRole =
  | "individual"
  | "organization"
  | "supplier"
  | "freelance_engineer"
  | "engineering_office"
  | "contractor";

// طرق التوثيق
export type AuthMethod = "email" | "phone" | "thirdParty";

// الحالة الأساسية المشتركة بين كل الأدوار
export interface BaseRegistrationState {
  currentRole: RegistrationRole | null;
  currentStep: string | null;
  authMethod: AuthMethod | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface PersonalInfo {
  name?: string; // Full name field from validation schema
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string; // Primary phone field from validation schema
  phoneNumber?: string; // Legacy field for backward compatibility
  password?: string;
  password_confirmation?: string; // Field name from validation schema
  confirmPassword?: string; // Legacy field for backward compatibility
  organizationEmail?: string;
  organizationPhoneNumber?: string;
  authorizedPersonMobileNumber?: string;
  country_id?: string; // From validation schema
  commercial_register_file?: File; // From validation schema
  // Role-specific fields
  national_id?: string;
  business_name?: string;
  commercial_register_number?: string;
  license_number?: string;
  engineers_association_number?: string;
}
// بيانات خاصة بكل دور (تجمع كل أنواع الـ info)
export interface RoleSpecificData {
  personalInfo?: PersonalInfo;
  phoneInfo?: Record<string, unknown>;
  thirdPartyInfo?: ThirdPartyAuthData;
  documentUpload?: DocumentUploadData;
  professionalInfo?: Record<string, unknown>;
  operationalCommercialInfo?: Record<string, unknown>;
  technicalOperationalInfo?: Record<string, unknown>;
  planSelection?: Record<string, unknown>;
  [key: string]: unknown; // مرونة لإضافة steps جديدة مستقبلاً
}
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { [key: string]: string[] };
}

// Common Auth Request/Response Types
export interface AuthRequest {
  email?: string;
  phoneNumber?: string;
  password?: string;
  otp?: string;
  thirdPartyToken?: string;
}

export interface AuthResponse {
  message: string;
  response: {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_type: string;
    status: string;
    avatar_url?: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    account_overview: {
      profile_status: string;
      document_status: string;
      overall_status: string;
      rejection_reasons: string[];
      verification_status: {
        verification_required: boolean;
        email_verified: boolean;
        phone_verified: boolean;
        email_verification_enabled: boolean;
        phone_verification_enabled: boolean;
        pending_actions: string[];
      };
      verification_required: {
        email_verification: {
          has_token: boolean;
          token_type: string | null;
        };
        phone_verification: {
          has_token: boolean;
          token_type: string | null;
        };
      };
    };

    extra: {
      tokens: {
        access_token: string;
        access_token_expires_at: string;
        access_token_expires_in: number;
        token_type: string;
        refresh_token: string;
        refresh_token_expires_at: string;
        refresh_token_expires_in: number;
      };
    };
  };
  tokens?: TokenData;
  user?: AuthUser;
  extra?: {
    tokens: TokenData;
  };
}

// Registration Request/Response Types
export interface RegistrationRequest<
  T extends RegistrationData = RegistrationData
> {
  userType: string;
  role: RegistrationRole;
  authMethod: AuthMethod;
  data: T;
}

export interface RegistrationResponse {
  message: string;
  response: {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_type: string;
    account_overview: {
      verification_status: {
        verification_required: boolean;
        email_verified: boolean;
        phone_verified: boolean;
      };
      verification_required: {
        email_verification: {
          has_token: boolean;
          token_type: string;
        };
        phone_verification: {
          has_token: boolean;
          token_type: string;
        };
      };
    };
    extra: {
      tokens?: {
        access_token: string;
        access_token_expires_at: string;
        access_token_expires_in: number;
        token_type: string;
        refresh_token: string;
        refresh_token_expires_at: string;
        refresh_token_expires_in: number;
      };
    };
  };
}

export interface ForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
// Verification Request/Response Types
export interface VerificationRequest {
  contactInfo: string; // email or phone number
  token: string;
}

export interface VerificationResponse {
  message: string;
  isVerified: boolean;
}

// New verification types based on the API response
export interface VerificationStatus {
  verification_required: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  email_verification_enabled: boolean;
  phone_verification_enabled: boolean;
  pending_actions: string[];
}

export interface VerificationRequired {
  email_verification: {
    has_token: boolean;
    token_type: string | null;
  };
  phone_verification: {
    has_token: boolean;
    token_type: string | null;
  };
}

export interface VerificationStatusResponse {
  verification_status: VerificationStatus;
  verification_required: VerificationRequired;
}

export interface VerifyPhoneRequest {
  phoneNumber: string;
  token: string;
}

export interface VerifyPhoneResponse {
  message: string;
  isVerified: boolean;
}

// Resend email verification (for existing users)
export interface ResendEmailVerificationRequest {
  email?: string; // Optional, can use current user's email
}

export interface ResendEmailVerificationResponse {
  message: string;
  success: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  isVerified: boolean;
}

// Resend OTP Request/Response Types
export interface ResendOtpRequest {
  contactInfo: string; // email or phone number
}

export interface ResendOtpResponse {
  message: string;
}

// Specific Registration Data Payloads (simplified for API)
// These should mirror the Zod schemas but be flattened for API consumption

// Base registration data interface matching the validation schema
export interface BaseRegistrationData {
  name: string;
  email?: string;
  phone: string;
  password: string;
  password_confirmation: string;
  country_id?: string;
  commercial_register_file?: File;
}

// Individual registration data
export interface IndividualRegistrationData extends BaseRegistrationData {
  national_id: string;
}

// Supplier registration data
export interface SupplierRegistrationData extends BaseRegistrationData {
  business_name: string;
  commercial_register_number: string;
}

// Engineering office registration data
export interface EngineeringOfficeRegistrationData
  extends BaseRegistrationData {
  business_name: string;
  license_number: string;
  commercial_register_number: string;
}

// Freelance engineer registration data
export interface FreelanceEngineerRegistrationData
  extends BaseRegistrationData {
  engineers_association_number: string;
}

// Contractor registration data
export interface ContractorRegistrationData extends BaseRegistrationData {
  business_name: string;
  commercial_register_number: string;
}

// Organization registration data
export interface OrganizationRegistrationData extends BaseRegistrationData {
  business_name: string;
  commercial_register_number: string;
}

// Governmental registration data
export interface GovernmentalRegistrationData extends BaseRegistrationData {
  commercial_register_number: string;
}

// Union type for all registration data
export type RegistrationData =
  | IndividualRegistrationData
  | SupplierRegistrationData
  | EngineeringOfficeRegistrationData
  | FreelanceEngineerRegistrationData
  | ContractorRegistrationData
  | OrganizationRegistrationData
  | GovernmentalRegistrationData;

// Dynamic registration data type that includes all possible fields
export interface DynamicRegistrationData {
  // Base fields
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  country_id: string;
  commercial_register_file?: File;

  // Role-specific fields (all optional, will be populated based on role)
  national_id?: string;
  business_name?: string;
  commercial_register_number?: string;
  license_number?: string;
  engineers_association_number?: string;
}

// API request data type for registration
export interface RegistrationApiData {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  user_type: string;
  countryOfResidence?: string;

  // Role-specific fields
  national_id?: string;
  business_name?: string;
  commercial_register_number?: string;
  license_number?: string;
  engineers_association_number?: string;
  commercial_register_file?: File;
}

// Dynamic form data type for form handling
export interface DynamicFormData {
  // Base fields (required)
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  country_id: string;
  commercial_register_file?: File;

  // Role-specific fields (all optional, will be populated based on role)
  national_id?: string;
  business_name?: string;
  commercial_register_number?: string;
  license_number?: string;
  engineers_association_number?: string;
}

// Type guards for registration data
export const isIndividualRegistrationData = (
  data: RegistrationData
): data is IndividualRegistrationData => {
  return "national_id" in data;
};

export const isSupplierRegistrationData = (
  data: RegistrationData
): data is SupplierRegistrationData => {
  return (
    "commercial_register_number" in data &&
    !("license_number" in data) &&
    !("engineers_association_number" in data)
  );
};

export const isEngineeringOfficeRegistrationData = (
  data: RegistrationData
): data is EngineeringOfficeRegistrationData => {
  return "license_number" in data && "commercial_register_number" in data;
};

export const isFreelanceEngineerRegistrationData = (
  data: RegistrationData
): data is FreelanceEngineerRegistrationData => {
  return "engineers_association_number" in data;
};

export const isContractorRegistrationData = (
  data: RegistrationData
): data is ContractorRegistrationData => {
  return (
    "commercial_register_number" in data &&
    !("license_number" in data) &&
    !("engineers_association_number" in data) &&
    !("national_id" in data)
  );
};

export const isOrganizationRegistrationData = (
  data: RegistrationData
): data is OrganizationRegistrationData => {
  return (
    "commercial_register_number" in data &&
    !("license_number" in data) &&
    !("engineers_association_number" in data) &&
    !("national_id" in data)
  );
};

export const isGovernmentalRegistrationData = (
  data: RegistrationData
): data is GovernmentalRegistrationData => {
  return (
    "commercial_register_number" in data &&
    !("license_number" in data) &&
    !("engineers_association_number" in data) &&
    !("national_id" in data)
  );
};

// Legacy API data interface (for backward compatibility)
export interface IndividualRegistrationApiData {
  name: string;
  email?: string;
  phone: string;
  password?: string;
  countryOfResidence: string;
  nationalId?: string; // For API, this would be a FormData entry
  // thirdPartyInfo?: { token: string; provider: string };
}

// Token Data Types
export interface TokenData {
  access_token: string;
  access_token_expires_at: string;
  access_token_expires_in: number;
  token_type: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  refresh_token_expires_in: number;
}

// API Error Types
export type ApiError<T = any> = {
  response?: {
    data?: {
      message?: string;
      errors?: T;
      [key: string]: any;
    };
    status?: number;
    [key: string]: any;
  };
  message?: string;
  code?: string;
  [key: string]: any;
};

// Form Data Types
export interface FormDataEntry {
  key: string;
  value: string | File;
}

// Google Auth Types
export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

export interface GoogleProfile {
  email: string;
  given_name?: string;
  givenName?: string;
  family_name?: string;
  familyName?: string;
  name?: string;
  picture?: string;
  sub: string;
}

// Third Party Auth Types
export interface ThirdPartyAuthData {
  token: string;
  provider: string;
  email?: string;
  name?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

// Document Upload Types
export interface DocumentUploadData {
  file: File;
  documentType: string;
  role: string;
}

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Store Types
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  country_id?: number;
  city_id?: number;
  state_id?: number;
  national_id?: string;
  detailed_address?: string;
  about_me?: string;
  avatar_url?: string;
  status: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  account_overview: {
    profile_status: string;
    document_status: string;
    overall_status: string;
    rejection_reasons: string[];
    verification_status: {
      verification_required: boolean;
      email_verified: boolean;
      phone_verified: boolean;
      email_verification_enabled: boolean;
      phone_verification_enabled: boolean;
      pending_actions: string[];
    };
    verification_required: {
      email_verification: {
        has_token: boolean;
        token_type: string | null;
      };
      phone_verification: {
        has_token: boolean;
        token_type: string | null;
      };
    };
  };
}

// Phone Input Types
export interface PhoneInputProps {
  value?: Value;
  onChange: (value?: Value) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: Country | undefined;
  countries?: Country[];
  preferredCountries?: Country[];
  excludeCountries?: Country[];
  countryCallingCodeEditable?: boolean;
  international?: boolean;
  withCountryCallingCode?: boolean;
  countrySelectProps?: Record<string, unknown>;
  inputProps?: Record<string, unknown>;
  [key: string]: unknown;
}

// Custom Input Types
export interface CustomInputProps {
  className?: string;
  [key: string]: unknown;
}

// Validation-related types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  data?: any;
}

// Form field types for better type safety
export type FormFieldName =
  | "name"
  | "email"
  | "phone"
  | "password"
  | "password_confirmation"
  | "national_id"
  | "commercial_register_number"
  | "license_number"
  | "engineers_association_number"
  | "country_id"
  | "commercial_register_file";

export type ValidationFieldName =
  | FormFieldName
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "confirmPassword";

// OTP Verification Types
export interface OTPVerificationProps {
  personalInfo: PersonalInfo;
  phoneInfo?: Record<string, unknown>;
  thirdPartyInfo?: Record<string, unknown>;
}

// Role Selector Types
export interface UserRoleOption {
  id: string;
  name?: string;
  description?: string;
  icon?: string | React.ReactElement;
  features?: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  comingSoon?: boolean;
}

// Registration Store Interface
export interface RegistrationStore {
  currentStep: string;
  currentRole: RegistrationRole | null;
  authMethod: AuthMethod | null;
  personalInfo: PersonalInfo;
  phoneInfo?: Record<string, unknown>;
  thirdPartyInfo?: ThirdPartyAuthData;
  registrationData?: RegistrationData;
  isLoading: boolean;
  error: string | null;
}
