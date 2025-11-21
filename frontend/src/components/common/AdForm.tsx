import React, { useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { setAdFormData } from "../../state/slices/adFormSlice";
import {  useNavigate } from "react-router-dom";
import { AdFormState } from "../../types/index";
import { toast } from "react-toastify";

import CampaignCard from "./cards/CampaignCard";
import TargetAreaCard from "./cards/TargetAreaCard";
import CompanyDetails from "./ad-form-sections/CompanyDetails";
import AdPlatformSelection from "./ad-form-sections/AdPlatformSelection";
import AdSchedule from "./ad-form-sections/AdSchedule";


const AdForm: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const adFormData = useSelector((state: RootState) => state.adForm); // Directly use Redux state
    const campaignSettings = useSelector((state: RootState) => state.workspace.defaultWorkspace?.campaignSetting);

useEffect(() => {
    // campaign settiongs update
    if (campaignSettings ) {
        if(campaignSettings.targetAreas && campaignSettings.targetAreas.length > 0) {
        dispatch(setAdFormData({
            ...adFormData,targetAreas: campaignSettings.targetAreas,gender: campaignSettings.gender}));
    }
        // if(campaignSettings.gender) {
        //     dispatch(setAdFormData({
        //         ...adFormData,gender: campaignSettings.gender}));}
}
}, []); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        const key = mapFormValues(id);
        dispatch(setAdFormData({ ...adFormData, [key]: value }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // When the user interacts with any input field, clear the specific validation error for that field
        const fieldName = mapFormValues(e.target.id);
        if (validationErrors[fieldName]) {
            setValidationErrors({ ...validationErrors, [fieldName]: undefined });
        }
    };

    const onInputChange = (field: keyof AdFormState) => {
        if (validationErrors[field]) {
            setValidationErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field]; // Remove error for this field
                return newErrors;
            });
        }
    };


    const mapFormValues = (id: string): string => {
        switch (id) {
            case "Facebook":
            case "Instagram":
            case "BothPlatforms":
                return "selectPlatform";
            case "Sales":
            case "App_promotion":
            case "Leads":
            case "Traffic":
            case "Engagement":
            case "Awareness":
                return "campaignType";
            default:
                return id;
        }
    };

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        const updatedData = { ...adFormData, setEndDate: checked };

        if (checked) {
            const startDate = adFormData.scheduleStartDate
                ? new Date(adFormData.scheduleStartDate.split('/').reverse().join('-'))
                : new Date();

            startDate.setDate(startDate.getDate() + 5);
            updatedData.scheduleEndDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1)
                .toString().padStart(2, '0')}/${startDate.getFullYear()}`;
        } else {
            updatedData.scheduleEndDate = ""
        }

        dispatch(setAdFormData(updatedData));
    };

    const handleAddArea = () => {
        if (adFormData.targetArea.trim() !== "") {
            dispatch(setAdFormData({
                ...adFormData,
                targetAreas: [...adFormData.targetAreas, adFormData.targetArea.trim()],
                targetArea: "", // Reset input
            }));
        }
    };

    const handleDateChange = (key: string, date: string) => {
        const updatedData = { ...adFormData, [key]: date };

        if (key === "scheduleStartDate" && adFormData.setEndDate) {
            const startDate = new Date(date.split('/').reverse().join('-'));
            startDate.setDate(startDate.getDate() + 5);
            updatedData.scheduleEndDate = `${startDate.getDate().toString().padStart(2, '0')}/${(startDate.getMonth() + 1)
                .toString().padStart(2, '0')}/${startDate.getFullYear()}`;
        }

        dispatch(setAdFormData(updatedData));
    };

    const handleTimeChange = (key: string, time: string) => {
        dispatch(setAdFormData({ ...adFormData, [key]: time }));
    };

    const handleRemoveArea = (area: string) => {
        dispatch(setAdFormData({
            ...adFormData,
            targetAreas: adFormData.targetAreas.filter(item => item !== area)
        }))
    };

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (validateForm()) {
            dispatch(setAdFormData(adFormData)); // Save to Redux
            // handlePayment()
            navigate("/designs");
        }
    };

    // const handlePayment = async () => {
    //     if (!razorpayLoaded) {
    //         toast.warn("Razorpay is still loading. Please try again.");
    //         return;
    //     }
    //         dispatch(setLoading(true)); // Start loading
    //     try {
    //         const params = { amount: adFormData.budget };
    //         const orderData = await createOrder(params);
    //         if (!orderData.id) {
    //             toast.error("Oops! Something went wrong.");
    //             return;
    //         }
    //         const options = {
    //             key: import.meta.env.VITE_RAZOR_PAY_KEY,
    //             amount: orderData.amount,
    //             currency: "INR",
    //             name: "My Business",
    //             description: "Test Transaction",
    //             order_id: orderData.id,
    //             handler: async (response: any) => {
    //                 const verifyDataParams = {
    //                     razorpay_order_id: response.razorpay_order_id,
    //                     razorpay_payment_id: response.razorpay_payment_id,
    //                     razorpay_signature: response.razorpay_signature,
    //                 };
    //                 const verifyData = await verifyPayment(verifyDataParams);
    //                 if (verifyData.success) {
    //                     toast.success("Payment Verified Successfully!");
    //                 } else {
    //                     toast.error("Payment Verification Failed!");
    //                 }
    //             },
    //             theme: { color: "#069B49" },
    //         };
    //         const rzp = new (window as any).Razorpay(options);
    //         rzp.open();
    //     } catch (error) {
    //         console.error("Error:", error);
    //         toast.error("Oops! Something went wrong.");
    //     }finally {
    //         dispatch(setLoading(false)); 
    //     }
    // };



    const validateForm = (): boolean => {
        let errors: any = {};
        let isValid: boolean = true;
        const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/;
        // CompanyDetails validation
        if (!adFormData.companyName) {
            errors.companyName = "Company Name is required.";
            // toast.error("Company Name is required.");
            isValid = false;
        }
        if (!adFormData.campaignMessage) {
            errors.campaignMessage = "Product/Service is required.";
            // toast.error("Product/Service is required.");
            isValid = false;
        }

        // AdPlatformSelection validation
        if (!adFormData.selectPlatform) {
            errors.selectPlatform = "Please select a platform.";
            // toast.error("Please select a platform.");
            isValid = false;
        }

        // AdSchedule validation
        if (!adFormData.scheduleStartDate) {
            errors.scheduleStartDate = "Start Date is required.";
            // toast.error("Start Date is required.");
            isValid = false;
        }
        if (adFormData.setEndDate && !adFormData.scheduleEndDate) {
            errors.scheduleEndDate = "End Date is required.";
            // toast.error("End Date is required.");
            isValid = false;
        }

        // TargetAreaCard validation
        if (adFormData.targetAreas.length === 0) {
            errors.targetAreas = "At least one target area is required.";
            toast.error("At least one target area is required.");
            isValid = false;
        }

        if (!adFormData.budget) {
            errors.budget = "Budget must be greater than 0.";
            // toast.error("Budget must be greater than 0.");
            isValid = false;
        }
        if (!adFormData.websiteURL && adFormData.campaignType === "Traffic") {
            errors.websiteURL = "Website URL is required.";
            isValid = false;
        } else if (!urlPattern.test(adFormData.websiteURL) && adFormData.campaignType === "Traffic") {
            errors.websiteURL = "Please enter a valid URL (e.g., https://example.com).";
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };
    return (
        <div className="container">
            <div className="row g-20 mt-0">
                <CompanyDetails
                    formData={adFormData}
                    onChange={handleChange}
                    validationErrors={validationErrors}
                    onInputChange={handleInputChange} // Pass onInputChange to clear validation errors
                /><AdPlatformSelection
                    formData={adFormData}
                    onChange={handleChange}
                    validationErrors={validationErrors}
                    onInputChange={handleInputChange}
                />            <div className="col-lg-5">
                    <CampaignCard formData={adFormData} handleChange={handleChange} />
                    <AdSchedule
                        formData={adFormData}
                        handleCheckboxChange={handleCheckboxChange}
                        handleDateChange={handleDateChange}
                        handleTimeChange={handleTimeChange}
                        validationErrors={validationErrors}
                        onInputChange={onInputChange} // Pass function to clear errors
                    />
                </div>
                <TargetAreaCard
                    formData={adFormData}
                    handleChange={handleChange}
                    handleAddArea={handleAddArea}
                    handleRemoveArea={handleRemoveArea}
                    validationErrors={validationErrors}
                    onInputChange={handleInputChange}
                />
            </div>
            {/* <AdMediaUpload
                uploadedMedia={adFormData.uploadedMedia}
                handleFileUpload={handleFileUpload}
                handleRemoveFile={handleRemoveFile}
            /> */}
            <div className="text-center text-md-end">

                <button className="btn btn-secondary d-inline-flex mt-4" onClick={(e) => { handleSubmit(e) }} >Continue</button>

            </div>
        </div>
    );
};

export default AdForm;
