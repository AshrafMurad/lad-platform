// Special characters constant
const SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>';

// For server-side feedback.validation or contexts where hooks can't be used
export const getValidationMessages = (
  t: (key: string, values?: Record<string, string>) => string
) => ({
  firstName: {
    required: t("feedback.validation.firstName.required"),
    minLength: t("feedback.validation.firstName.minLength"),
  },
  lastName: {
    required: t("feedback.validation.lastName.required"),
    minLength: t("feedback.validation.lastName.minLength"),
  },
  email: {
    required: t("feedback.validation.email.required"),
    invalid: t("feedback.validation.email.invalid"),
    maxLength: t("feedback.validation.email.maxLength"),
  },
  phoneNumber: {
    required: t("feedback.validation.phoneNumber.required"),
    minLength: t("feedback.validation.phoneNumber.minLength"),
  },
  emailOrPhone: {
    required: t("feedback.validation.emailOrPhone.required"),
    invalid: t("feedback.validation.emailOrPhone.invalid"),
  },
  password: {
    required: t("feedback.validation.password.required"),
    minLength: t("feedback.validation.password.minLength"),
    lowercase: t("feedback.validation.password.lowercase"),
    uppercase: t("feedback.validation.password.uppercase"),
    symbol: t("feedback.validation.password.symbol", { chars: SPECIAL_CHARS }),
  },
  confirmPassword: {
    required: t("feedback.validation.confirmPassword.required"),
    mismatch: t("feedback.validation.confirmPassword.mismatch"),
  },
  terms: {
    required: t("feedback.validation.terms.required"),
  },
  otp: {
    length: t("feedback.validation.otp.length"),
  },
  name: {
    required: t("feedback.validation.name.required"),
    minLength: t("feedback.validation.name.minLength"),
    maxLength: t("feedback.validation.name.maxLength"),
    invalid: t("feedback.validation.name.invalid"),
  },
  phone: {
    required: t("feedback.validation.phone.required"),
    invalid: t("feedback.validation.phone.invalid"),
  },
  nationalId: {
    required: t("feedback.validation.nationalId.required"),
    invalid: t("feedback.validation.nationalId.minLength"), // Using minLength as invalid since it's 10 digits
  },
  commercialRegisterNumber: {
    required: t("feedback.validation.commercialRegisterNumber.required"),
    invalid: t("feedback.validation.commercialRegisterNumber.invalid"),
  },
  licenseNumber: {
    required: t("feedback.validation.licenseNumber.required"),
    maxLength: t("feedback.validation.licenseNumber.maxLength"),
  },
  engineersAssociationNumber: {
    required: t("feedback.validation.engineersAssociationNumber.required"),
    maxLength: t("feedback.validation.engineersAssociationNumber.maxLength"),
  },
  country: {
    required: t("feedback.validation.country.required"),
  },
  businessName: {
    required: t("feedback.validation.businessName.required"),
    minLength: t("feedback.validation.businessName.minLength"),
    maxLength: t("feedback.validation.businessName.maxLength"),
  },
  commercialRegisterFile: {
    required: t("feedback.validation.commercialRegisterFile.required"),
    maxSize: t("feedback.validation.commercialRegisterFile.maxSize"),
    invalidType: t("feedback.validation.commercialRegisterFile.invalidType"),
  },
});
