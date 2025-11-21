// state/slices/workspaceSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DefaultWorkspace,Workspace } from "../../types";

interface WorkspaceState {
  defaultWorkspace: DefaultWorkspace;
  allWorkspaces: Workspace[];
}

const initialState: WorkspaceState = {
  defaultWorkspace: {
      id: '',
      name: '',
      yourRole:'member', 
      members: [], 
      role: 'member',  
      imageUrl: "",
      campaignSetting: {
        gender: "All",
        targetAreas: [],
      },
      settings: {
        business_category: "",
        currency: "",
        timezone: "",
        financial_year: "",
        enable_notification: false,
      }
  },
  allWorkspaces: [],
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setDefaultWorkspace(state, action: PayloadAction<DefaultWorkspace>) {
      state.defaultWorkspace = action.payload;
    },
    setAllWorkspaces(state, action: PayloadAction<Workspace[]>) {
      state.allWorkspaces = action.payload;
    },
    clearWorkspaces(state) {
      state.defaultWorkspace = initialState.defaultWorkspace;
      state.allWorkspaces = initialState.allWorkspaces;
    },
    setDefaultWorkspaceMembers(state, action: PayloadAction<DefaultWorkspace>) {
      state.defaultWorkspace.members = action.payload.members
    }
  },
});

export const {
  setDefaultWorkspace,
  setAllWorkspaces,
  clearWorkspaces,
  setDefaultWorkspaceMembers,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
