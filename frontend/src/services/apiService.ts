import axiosInstance from "../utils/axiosInstance";
import * as Types from "../types/index";



export const loginUser = async (data: Types.LoginData): Promise<Types.LoginResponse> => {
  try {
    const response = await axiosInstance.post<Types.LoginResponse>("/api/auth/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signupUser = async (data: Types.SignupData): Promise<Types.SignupResponse> => {
  try {
    const response = await axiosInstance.post<Types.SignupResponse>("/api/auth/signup", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create Razorpay Order
export const createOrder = async (data: Types.OrderParams): Promise<Types.OrderResponse> => {
  try {
    const response = await axiosInstance.post<Types.OrderResponse>("/api/payment/create-order", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Verify Payment
export const verifyPayment = async (data: Types.VerifyPaymentData): Promise<Types.SuccessMessageResponse> => {
  try {
    const response = await axiosInstance.post<Types.SuccessMessageResponse>("/api/payment/verify-payment", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const generateAiAd = async (data: Types.generateAiParams): Promise<Types.generateAiResponse> => {
  try {
    const response = await axiosInstance.post<Types.generateAiResponse>("/api/ad/generate", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const switchWorkspace = async (workspaceId: string): Promise<Types.SwitchWorkspaceResponse> => {
  try {
    const response = await axiosInstance.post<Types.SwitchWorkspaceResponse>(
      "/api/auth/switch-workspace", { workspaceId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSessionData = async (): Promise<Types.GetSessionDataResponse> => {
  try {
    const response = await axiosInstance.post<Types.GetSessionDataResponse>("/api/auth/session");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createWorkSpace = async (data: Types.CreateWorkSpaceParams): Promise<Types.CreateWorkSpaceResponse> => {
  try {
    const response = await axiosInstance.post<Types.CreateWorkSpaceResponse>("/workspace/create", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const inviteUserToWorkSpace = async (data: Types.InviteUserParams): Promise<Types.InviteUserToWorkSpaceResponse> => {
  try {
    const response = await axiosInstance.post<Types.InviteUserToWorkSpaceResponse>("/workspace/invite-member", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkspaceMember = async (id: number): Promise<Types.DeleteWorkspaceMemberResponse> => {
  try {
    const response = await axiosInstance.delete<Types.DeleteWorkspaceMemberResponse>(`/workspace/members/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const leaveWorkspace = async (data: Types.LeaveWorkspaceParams): Promise<Types.LeaveWorkspaceResponse> => {
  try {
    const response = await axiosInstance.post<Types.LeaveWorkspaceResponse>(`/workspace/leave`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWorkspace = async (id: string): Promise<Types.DeleteWorkspaceResponse> => {
  try {
    const response = await axiosInstance.delete<Types.DeleteWorkspaceResponse>(`/workspace/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAiImage = async (data: Types.GetAiImageParams): Promise<Types.GetAiImageResponse> => {
  try {
    const response = await axiosInstance.post<Types.GetAiImageResponse>("/api/generate-images", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const uploadImage = async (
  data: File, end_point: string
): Promise<Types.uploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", data);
    const response = await axiosInstance.post<Types.uploadImageResponse>(`/api/${end_point}`, formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorkspace = async (
  data: Types.SaveDefaultWorkspaceParams): Promise<Types.SaveDefaultWorkspaceResponse> => {
  try {
    const response = await axiosInstance.patch<Types.SaveDefaultWorkspaceResponse>("/workspace/update-workspace", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (
  data: Types.UpdateUserParams): Promise<Types.UpdateUserResponse> => {
  try {
    const response = await axiosInstance.patch<Types.UpdateUserResponse>("/api/auth/update-user", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveAd = async (
  imageFile: File,
  metadata: Types.SaveAdMetadata
): Promise<Types.SaveAdResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("metadata", JSON.stringify(metadata));
    const response = await axiosInstance.post<Types.SaveAdResponse>("/api/ad/save-ad", formData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWorkspaceSettings = async (
  payload: Types.WorkspaceSettingsPayload
): Promise<Types.WorkspaceSettingsResponse> => {
  try {
    const response = await axiosInstance.post<Types.WorkspaceSettingsResponse>("/workspace/settings", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAdInsights = async (
  payload: Types.AdInsightsPayload
): Promise<Types.AdInsightsResponse> => {
  try {
    const response = await axiosInstance.post<Types.AdInsightsResponse>("/api/ad/insights", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch Notifications
export const getNotifications = async (
  payload: Types.NotificationPages
): Promise<Types.NotificationPages> => {
  try {
    const response = await axiosInstance.get<Types.NotificationPages>(`/api/notifications?page=${payload}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Mark Notification as Read
export const markNotificationAsRead = async (
  payload: Types.NotificationIdPayload
): Promise<Types.NotificationIdPayload> => {
  try {
    const response = await axiosInstance.post<Types.NotificationIdPayload>("/api/notifications/mark-read", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete Notification
export const deleteNotification = async (
  payload: Types.DeleteNotificationPayload
): Promise<Types.DeleteNotificationPayload> => {
  try {
    const response = await axiosInstance.post<Types.DeleteNotificationPayload>("/api/notifications/delete", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Clear All Notifications
export const clearAllNotifications = async (
  userId?: string
): Promise<Types.Notification> => {
  try {
    const response = await axiosInstance.post<Types.Notification>(
      "/api/notifications/clear-all",
      userId ? { userId } : {}
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAdLeads = async (): Promise<Types.FetchLeadsResponse> => {
  try {
    const response = await axiosInstance.post<Types.FetchLeadsResponse>("/api/ad/leads");
    return response.data;
  } catch (error) {
    throw error;
  };
}
export const toggleAdStatus = async (
  campaignId: string,
  payload: Types.ToggleAdStatusPayload
): Promise<Types.ToggleAdStatusResponse> => {
  const response = await axiosInstance.post<Types.ToggleAdStatusResponse>(
    `/api/ad/${campaignId}/status`,
    payload
  );
  return response.data;
};

// Add Campaign Setting
export const addCampaignSetting = async (data: Types.AdCampaignSettingParams): Promise<Types.AdCampaignSettingResponse> => {
  try {
    const response = await axiosInstance.post<Types.AdCampaignSettingResponse>("/api/ad/campaign-setting", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get states

export const fetchCitySuggestions = async (query: string): Promise<Types.FetchCitySuggestionsResponse> => {
  try {
    const response = await axiosInstance.get<Types.FetchCitySuggestionsResponse>("/api/background/autocomplete", { params: { q: query }, });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchBackgroundImage = async (data: Types.FetchBackgroundImageParams): Promise<Blob> => {
  try {
    const response = await axiosInstance.post<Blob>("api/background/fetch-background", data, { responseType: "blob" });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch Admin Dashboard Data
export const fetchAdminDashboard = async (
  page: number,
  limit: number
): Promise<Types.FetchAdminDashboardResponse> => {
  try {
    const response = await axiosInstance.get<Types.FetchAdminDashboardResponse>(`/api/admin/dashboard?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateGlobalSettings = async (payload: Types.UpdateGlobalSettingsPayload): Promise<Types.UpdateGlobalSettingsResponse> => {
  try {
    const response = await axiosInstance.put<Types.UpdateGlobalSettingsResponse>("/api/admin/globalsetting", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminDeleteWorkspace = async (
  workspaceId: string,
): Promise<Types.AdminDeleteWorkspaceResponse> => {
  try {
    const response = await axiosInstance.delete<Types.AdminDeleteWorkspaceResponse>(`/api/admin/${workspaceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminUpdateWorkspaceSettings = async (
  workspaceId: string,
  payload: Types.UpdateWorkspaceYieldPayload,
): Promise<Types.UpdateWorkspaceYieldResponse> => {
  try {
    const response = await axiosInstance.put<Types.UpdateWorkspaceYieldResponse>(`/api/admin/${workspaceId}/yield`, payload,);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWorkspaceMembers = async (
  workspaceId: string
): Promise<Types.GetWorkspaceMembersResponse> => {
  try {
    const response = await axiosInstance.get<Types.GetWorkspaceMembersResponse>(`/api/admin/${workspaceId}/members`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const adminChangeUserRole = async (
  payload: Types.ChangeRoleRequest
): Promise<Types.ChangeRoleResponse> => {
  const response = await axiosInstance.post<Types.ChangeRoleResponse>("/api/admin/change-role", payload);
  return response.data;
};

export const getAdminSessionData = async (): Promise<Types.GetAdminSessionDataResponse> => {
  try {
    const response = await axiosInstance.get<Types.GetAdminSessionDataResponse>("/api/admin/session");
    return response.data;
  } catch (error) {
    throw error;
  }
};