
export interface AdFormState {
  companyName: string;
  campaignMessage: string;
  category: string;
  selectPlatform: string;
  campaignType: string;
  scheduleStartDate: string;
  scheduleEndDate: string;
  scheduleStartTime: string;
  scheduleEndTime: string;
  timezone: string;
  setEndDate: boolean;
  targetArea: string;
  targetAreas: Array<any>;
  budget: number;
  budgetType: "lifetime_budget" | "daily_budget",
  uploadedMedia: Array<File>; // Store uploaded media files
  ageRange: [number, number];
  gender: "All" | "Male" | "Female" | string;
  websiteURL: string;
  adDuration: string;
  setupCompleted: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}


export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  defaultWorkspace: DefaultWorkspace;
  workspaces: Workspace[];
}


export interface SignupData {
  workspace_name: string;
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  user: User
}

export interface OrderResponse {
  id: string;
  amount: number;
}

export interface OrderParams {
  amount: number;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}


export interface generateAiParams {
  prompt: string;
}

export interface generateAiResponse {
  response: string;
  adData: {
    company_name: string;
    category: string;
    platform: string;
    target_location: string;
    budget: string;
    age_group: string; // e.g., "18-60" 
    gender: string;
    ad_objective: string;
    ad_duration: string; // e.g., "1 week", "2 weeks"
  }
  setupCompleted: boolean;
}


export interface ThemeField {
  key: string;
  label: string;
  defaultPosition: { x: number; y: number };
  fontSize: number;
  alignment: "left" | "center" | "right";
}

export interface Theme {
  id: string;
  name: string;
  fields: ThemeField[];
}

export interface LogoState {
  url: string;
  position: { x: number; y: number };
  size: number;
}

export interface ThemeState {
  selectedTheme: string | null;
  content: Record<string, string>;
  positions: Record<string, { x: number; y: number }>;
  logo: LogoState;
}



type ElementType = 'text' | 'image';

type DesignElement = {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  imageUrl?: string;
  width?: number;
  height?: number;
  rotate?: number;
  opacity?: number;
  textAlign?: "left" | "center" | "right" | "justify"; // Add this line
  isStrikethrough?: boolean; // Add this

};

export interface User {
  id: number;
  email: string;
  username: string;
  imageUrl?: string;
  isSuperAdmin?: boolean;
}
export interface WorkspaceMember {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
}
export interface Workspace {
  id: string;
  name: string;
  role?: "owner" | "admin" | "member"; // your role in this workspace, optional on workspace list
  imageUrl?: string;
}
export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
  defaultWorkspace: DefaultWorkspace;
  workspaces: Workspace[];
}

interface AuthState {
  isAuthenticated: boolean;
}

interface WorkspaceState {
  defaultWorkspace: DefaultWorkspace | null;
  workspaces: Workspace[];
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  imageUrl?: string;
}

export interface DefaultWorkspace {
  id: string;
  name: string;
  yourRole?: "owner" | "admin" | "member";
  imageUrl: string | null;
  role?: "owner" | "admin" | "member"; // optional, keep if needed
  members?: WorkspaceMember[];
  settings?: WorkspaceSettings;
  linkedPages?: LinkedPage[];
  campaignSetting?: CampaignSetting;
}

export interface LinkedPage {
  pageId: string;
  name: string;
  pageStatus: boolean;
  imageUrl?: string;
}

export interface WorkspaceSettings {
  business_category?: string;
  currency?: string;
  timezone?: string;
  financial_year?: string;
  enable_notification?: boolean;
}

export interface CampaignSetting {
  gender: "All" | "Male" | "Female" | string;
  targetAreas: string[];
}

export interface SwitchWorkspaceResponse {
  success: boolean;
  token: string;
  defaultWorkspace: DefaultWorkspace;
  workspaces: Workspace[];
}

export interface GetSessionDataResponse {
  user: User;
  success: boolean;
  token: string;
  defaultWorkspace: DefaultWorkspace;
  workspaces: Workspace[];
}

export interface CreateWorkSpaceParams {
  workspace_name: string;
}

export interface CreateWorkSpaceResponse {
  success: boolean;
  workspaceId: string;
}

export interface InviteUserParams {
  email: string;
  roleName: string;
}

export interface SuccessMessageResponse {
  success: boolean;
  message: string;
}

export interface LeaveWorkspaceParams {
  workspaceId: string;
}

export interface LeaveWorkspaceResponse {
  success: boolean;
  workspaces: Workspace[];
  message: string;
}

export interface DeleteWorkspaceMemberResponse {
  success: boolean;
  defaultWorkspace: DefaultWorkspace;
  message: string;
}

export interface InviteUserToWorkSpaceResponse {
  success: boolean;
  defaultWorkspace: DefaultWorkspace;
  message: string;
}

export interface DeleteWorkspaceResponse {
  success: boolean;
  workspaces: Workspace[];
  message: string;
  user: User;
  success: boolean;
  token: string;
  defaultWorkspace: DefaultWorkspace;
  members: WorkspaceMember[];
}

export interface GetAiImageResponse {
  success: boolean;
  message: string;
  images: string[];
}

export interface GetAiImageParams {
  businessName: string;
  category: string;
  city: string;
}


export type uploadImageParams = {
  file: File;
};

// Define response type if known, otherwise use `any` or create a type
export type uploadImageResponse = {
  success: boolean;
  imageUrl: string;
  message: string;
  // ...other fields returned by your API
};

export type SaveDefaultWorkspaceParams = {
  workspace_name: string;
}

export type DefaultWorkspaceFormData = {
  workspaceName: string;
}

export type userFormData = {
  username: string;
}

export interface SaveAdMetadata {
  campaignName: string;
  ad_objective: string;
  lifetime_budget: number;

  age_min: number;
  age_max: number;
  gender: string;

  publisher_platform: string;
  geo_location: Array<string>;
  destinationUrl: string;

  start_date: string;   // format: YYYY-MM-DD
  end_date: string;     // format: YYYY-MM-DD
  starttime: string;    // format: HH:MM
  endtime: string;      // format: HH:MM
}



export interface SaveAdResponse {
  message: string;
  draftId: number;
}

export interface SaveDefaultWorkspaceResponse {
  success: boolean;
  message: string;
  username: User;
}

export interface UpdateUserParams {
  newUsername: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export type WorkspaceSettingsPayload = {
  business_category: string;
  currency: string;
  timezone: string;
  financial_year: string;
  enable_notification: boolean;
};

export type WorkspaceSettingsResponse = {
  success: boolean;
  message: string;
};
export interface AdInsightsPayload {
  start_date: string; // e.g. "2025-07-01"
  end_date: string;   // e.g. "2025-07-18"
  after?: string;
  limit?: number;
  page?: number;
}
export interface AdInsight {
  impressions?: string;
  clicks?: string;
  spend?: string;
  reach?: string;
  date_start?: string;
  date_stop?: string;
}

export interface CampaignInsight {
  campaignId: string;
  campaignName: string;
  status: string;
  insights?: AdInsight;
}

export interface AdInsightsResponse {
  success: boolean;
  data: CampaignInsight[];
  pagination: PaginationState
}

export interface FetchLeadsResponse {
  success: boolean;
  data: LeadFormEntry[];
}

export interface LeadFormEntry {
  leadFormId: string;
  leads: Lead[];
}

export interface Lead {
  id: string;
  created_time: string;
  field_data: FieldData[];
}

export interface FieldData {
  name: "full_name" | "phone_number" | "email" | "inbox_url" | string;
  values: string[];
}

export interface FlatLead {
  leadFormId: string;
  id: string;
  created_time: string;
  full_name?: string;
  phone_number?: string;
  email?: string;
  inbox_url?: string;
}

// Payload for toggling ad status
export interface ToggleAdStatusPayload {
  status: "ACTIVE" | "PAUSED";
}

// Response from the API
export interface ToggleAdStatusResponse {
  success: boolean;
  message: string;
}



export interface NotificationIdPayload {
  notificationId: string;
}
export interface DeleteNotificationPayload {
  notificationId: string;
}
export interface NotificationPages {
  page: number;
}
export interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
export interface NotificationResponse {
  notifications: Notification[];
  currentPage: number;
  totalPages: number;
}

export interface AdCampaignSettingParams {

  gender: "All" | "Male" | "Female" | string;
  targetAreas: string[];
}
export interface AdCampaignSettingResponse {
  success: boolean;
  message: string;
  user: User
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}


export interface FetchCitySuggestionsResponse {
  success: boolean;
  data: Array<{ city: string; state: string }>;
  message: string;
}

export interface AdPreviewDetails {
  pageName: string;
  profileImage: string;
  adTitle: string;
  adDescription: string;
  adImage: string;
  likes: number;
  comments?: number;
}

export interface FetchBackgroundImageParams {
  url: string;
}

export interface FetchBackgroundImageResponse {
  success: Blob;
  data: Blob;
  contentType: string;
  message: string;
}

export interface AdminWorkspace {
  id: string;
  name: string;
  workspacePic: string | null;
  yield: number | null;
  totalMembers: number;
  ownerName: string;
  maxUserPerWorkspace: number;
}

export interface GetAPIPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchAdminDashboardResponse {
  success: boolean;
  message: string;
  pagination: GetAPIPagination;
  data: AdminWorkspace[];
}

export interface TokenPayload {
  email: string;
  exp: number;         
  iat: number;         
  isSuperAdmin: boolean;
}
export interface UpdateGlobalSettingsPayload {
  yield: string; 
  globalMaxUserPerWorkspace: number;
}

export interface UpdateGlobalSettingsResponse {
  success: boolean;
  message: string;
}

export interface AdminDeleteWorkspaceResponse {
  message: string;
  success: boolean;}

export interface UpdateWorkspaceYieldPayload {
  yield: string;
  globalMaxUserPerWorkspace: number;
}

export interface UpdateWorkspaceYieldResponse {
  success: boolean;
  message: string;
}

export interface AdminWorkspaceMember {
  id: number;
  name: string;
  profilePic: string | null;
  role: string;
  joinedAt: string;
  email?: string; 
}

export interface GetWorkspaceMembersResponse {
  success: boolean;
  message: string;
  data: AdminWorkspaceMember[];
}

export interface ChangeRoleRequest {
  workspaceId: string;
  userId: number;
  newRole: "owner" | "admin" | "member";
}

export interface ChangeRoleResponse {
  success: boolean;
  message: string;
  updatedRole?: string;
}

export interface ChangeRoleRequest {
  workspaceId: string;
  userId: number;
  newRole: "owner" | "admin" | "member";
}

export interface ChangeRoleResponse {
  success: boolean;
  message: string;
  updatedRole?: string;
}

export interface GetAdminSessionDataResponse {
  success: boolean;
  data: {
    name: string;
    email: string;
  };
}