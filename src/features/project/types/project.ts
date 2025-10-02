export interface ProjectStatus {
  status: "in_progress" | "pending_review" | "published";
}
export interface Project {
  id: string;
  essential_info: ProjectEssentialInfo;
  classification: ProjectClassification;
  documents: DocumentsState;
  status: ProjectStatus;
  publish_settings: PublishSettings;
  boq: BOQData;
}

export interface UserProject {
  project: Project;
  created_at: string;
  updated_at: string;
}

export interface ProjectEssentialInfo {
  title: string;
  project_type_id: number; // Just the ID, not the full object
  city: string;
  district: string;
  location: string;
  budget: number;
  budget_unit: string;
  duration_value: number;
  duration_unit: string;
  area_sqm: number;
  description: string;
}

export interface ProjectClassificationJob {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}
export interface WorkType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface Level {
  id: number;
  level: number;
  label: string;
  sort_order: number;
}
export interface ProjectClassification {
  id: number;
  jobId: number; // Just the ID, not the full object
  workTypeId: number; // Just the ID, not the full object
  levelId: number; // Just the ID, not the full object
  notes: string;
}

export interface ProjectType {
  id: number;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentFile {
  id: string;
  file: File | null; // Can be null when loaded from backend
  name: string;
  size: number;
  type: string;
  uploadStatus: "pending" | "uploading" | "completed" | "error";
  uploadProgress: number;
  url?: string;
  error?: string;
}

export interface DocumentsState {
  architectural_plans: DocumentFile[];
  licenses: DocumentFile[];
  specifications: DocumentFile[];
  site_photos: DocumentFile[];
}

export interface BOQItem {
  id?: string;
  name: string;
  description: string;
  unit_id: number;
  quantity: number;
  unit_price: number;
  sort_order: number;
  is_required: boolean;
}

export interface BOQTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  items: BOQItem[];
  created_at: string;
  updated_at: string;
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  description: string;
  is_active: boolean;
}

export interface BOQData {
  items: BOQItem[];
  total_amount: number;
  template_id?: number;
}

// Form data type for BOQ item creation/editing
export type BOQItemFormData = Omit<BOQItem, "id">;

export interface PublishSettings {
  notify_matching_contractors: boolean;
  notify_client_on_offer: boolean;
  offers_window_days: number;
}
