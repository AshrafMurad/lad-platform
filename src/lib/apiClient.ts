import api from "@/lib/api";
import {
  containsFiles,
  toFormData,
  FormDataOptions,
} from "@/lib/formDataUtils";

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  response?: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  formDataOptions?: FormDataOptions;
  [key: string]: any;
}

/**
 * Enhanced request function with automatic multipart/form-data handling
 */

// Debounce mechanism to prevent rapid successive identical calls
const pendingRequests = new Map<string, Promise<any>>();

export async function request<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  // Create a unique key for this request (for GET requests only)
  const requestKey = method === "get" ? `${method}:${url}` : null;

  // Check if this exact GET request is already pending
  if (requestKey && pendingRequests.has(requestKey)) {
    console.log(`🔄 [API CLIENT] Returning cached pending request for: ${url}`);
    return pendingRequests.get(requestKey)!;
  }

  const requestPromise = executeRequest<T>(method, url, data, config);

  // Cache GET requests to prevent duplicates
  if (requestKey) {
    pendingRequests.set(requestKey, requestPromise);

    // Clean up after request completes
    requestPromise.finally(() => {
      pendingRequests.delete(requestKey);
    });
  }

  return requestPromise;
}

async function executeRequest<T>(
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> {
  try {
    let requestData = data;
    let requestConfig = { ...config };

    // 🔍 HIGH-LEVEL REQUEST LOGGING
    console.log(
      `📋 [API CLIENT] Starting ${method.toUpperCase()} request to: ${url}`
    );

    // Auto-detect if we need to use multipart/form-data
    if (data && containsFiles(data)) {
      console.log(
        `📎 [API CLIENT] Detected files in request, converting to FormData`
      );

      // Convert to FormData for file uploads using enhanced utilities
      requestData = toFormData(data, config.formDataOptions);

      // Set the correct content type for multipart data
      requestConfig.headers = {
        ...requestConfig.headers,
        "Content-Type": "multipart/form-data",
      };

      // Remove formDataOptions from config to avoid passing it to axios
      delete requestConfig.formDataOptions;
    }

    const response = await api.request({
      method,
      url,
      data: requestData,
      ...requestConfig,
    });

    // 🎉 SUCCESS LOGGING
    console.log(`✅ [API CLIENT] Request completed successfully for: ${url}`);
    console.log(`📊 [API CLIENT] Response structure:`, {
      success: response.data.success,
      hasData: !!response.data.data,
      hasResponse: !!response.data.response,
      message: response.data.message,
      hasMeta: !!response.data.meta,
    });

    // 🔍 DEBUG: Log actual data for product endpoints
    if (url.includes("my-products")) {
      console.log(`🔍 [API CLIENT] Raw product list data:`, response.data);
      console.log(
        `🔍 [API CLIENT] Products array:`,
        response.data.response || response.data.data
      );
      if ((response.data.response || response.data.data)?.length > 0) {
        console.log(
          `🔍 [API CLIENT] First product in list:`,
          (response.data.response || response.data.data)[0]
        );
      }
    }

    // 🔍 DEBUG: Log single product data structure
    if (
      url.includes("/supplier/products/") &&
      !url.includes("my-products") &&
      !url.includes("upload-files")
    ) {
      console.log(`🔍 [API CLIENT] Single product endpoint hit:`, url);
      console.log(
        `🔍 [API CLIENT] Raw single product response:`,
        response.data
      );
      console.log(
        `🔍 [API CLIENT] Single product data:`,
        response.data.response || response.data.data
      );
    }

    return {
      success: response.data.success,
      data: response.data.data,
      response: response.data.response,
      message: response.data.message,
      meta: response.data.meta,
    };
  } catch (error: any) {
    // 🚨 ERROR LOGGING
    console.group(`🚨 [API CLIENT ERROR] ${method.toUpperCase()} ${url}`);
    console.error(`❌ Raw Error:`, error);
    console.error(`📍 Error Type:`, error.name);
    console.error(`💬 Error Message:`, error.message);

    if (error.response) {
      console.error(`🌐 Response Status:`, error.response.status);
      console.error(`📝 Response Data:`, error.response.data);
      console.error(`🔗 Response Headers:`, error.response.headers);
    } else if (error.request) {
      console.error(`📡 Request made but no response received:`, error.request);
    }
    console.groupEnd();

    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong",
    };
  }
}
