import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdFormState } from "../../types";

const initialState: AdFormState  = {
  companyName: "",
  campaignMessage: "",
  category: "",
  selectPlatform: "Facebook",
  campaignType: "Awareness",
  scheduleStartDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "/"),
  scheduleEndDate: new Date().toLocaleDateString("en-GB").replace(/\//g, "/"),
  scheduleStartTime: "12:00",
  scheduleEndTime: "12:00",
  timezone: "IST",
  setEndDate: true,
  targetArea: "",
  targetAreas: [],
  budget: 0,
  budgetType:"daily_budget",
  uploadedMedia: [],
  ageRange: [18, 60],
  gender: "All",
  websiteURL: "",
  adDuration:"",
  setupCompleted: false,
};

const adFormSlice = createSlice({
  name: "adForm",
  initialState,
  reducers: {
    setAdFormData: (state, action: PayloadAction<Partial<AdFormState>>) => {
      return { ...state, ...action.payload };
    },
    addUploadedMedia: (state, action: PayloadAction<File[]>) => {
      state.uploadedMedia = [...state.uploadedMedia, ...action.payload];
    },
    removeUploadedMedia: (state, action: PayloadAction<number>) => {
      state.uploadedMedia.splice(action.payload, 1);
    },
    setAgeRange: (state, action: PayloadAction<[number, number]>) => {
      state.ageRange = action.payload;
    },
    setGender: (state, action: PayloadAction<"All" | "Male" | "Female">) => {
      state.gender = action.payload;
    },
    setBudget: (state, action: PayloadAction<number>) => {
      state.budget = action.payload;
    },
    setBudgetType: (state, action: PayloadAction<"lifetime_budget" | "daily_budget">) => {
      state.budgetType = action.payload;
    },
    setWebsiteURL: (state, action: PayloadAction<string>) => {
      state.websiteURL = action.payload;
    },
    setTargetAreas: (state, action: PayloadAction<string[]>) => {
      state.targetAreas = action.payload;
    }
  },
});

export const { setAdFormData, addUploadedMedia, removeUploadedMedia, setAgeRange, setGender, setBudget, setWebsiteURL, setBudgetType,setTargetAreas} = adFormSlice.actions;
export default adFormSlice.reducer;
