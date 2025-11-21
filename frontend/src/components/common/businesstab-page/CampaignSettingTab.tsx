import React, { useState , useRef, useEffect} from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { addCampaignSetting, fetchCitySuggestions } from "../../../services/apiService";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../state/slices/loadingSlice";
import { useSession } from "../../../hooks/session/useSession";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";

const CampaignSettingTab: React.FC = () => {
    const [targetAreas, setTargetAreas] = useState<string[]>([]);
    const [targetAreaInput, setTargetAreaInput] = useState("");
    const [allCities, setAllCities] = useState<string[]>([]);
    const [previousCities, setPreviousCities] = useState<string[]>([]);
    const defaultWorkspace = useSelector((state: RootState) => state.workspace.defaultWorkspace);

    const dispatch = useDispatch();
    const { fetchSession } = useSession();
    const handleAddArea = () => {
        const trimmed = targetAreaInput.trim();
        if (!trimmed) {
            toast.error("Please enter a target area.");
            return;
        }
        if (!previousCities.includes(trimmed)) {
            toast.error("Please select a valid city from the list.");
            return;
        }
        if (targetAreas.includes(trimmed)) {
            toast.error("Area already added.");
            return;
        }
        setTargetAreas([...targetAreas, trimmed]);
        setTargetAreaInput("");
    };

    const handleRemoveArea = (areaToRemove: string) => {
        setTargetAreas(targetAreas.filter((area) => area !== areaToRemove));
    };

    const handleSubmit = async (values: { gender: string }) => {
        if (targetAreas.length === 0) {
            toast.error("Please add at least one valid target area.");
            return;
        }

        let isSessionNeedsUpdate = false;
        try {
            dispatch(setLoading(true));
            let res =  await addCampaignSetting({ gender: values.gender, targetAreas: targetAreas });
            if (res.success) {
                toast.success("Campaign settings saved successfully.");
                isSessionNeedsUpdate = true;
            }
        } catch (err: any) {
            toast.error(err.message || "Oops! Something went wrong.");
        }finally {
            dispatch(setLoading(false));
            isSessionNeedsUpdate && await fetchSession();
        }
    };

    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const fetchCities = async (query: string) => {
        if (!query ) return;

        try {
            const data = await fetchCitySuggestions(query);
            const cityList = data.data.map((item) => `${item.city}, ${item.state}`);
            setPreviousCities(allCities);
            setAllCities(cityList);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    };


    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetAreaInput(e.target.value)
        const value = e.target.value;
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchCities(value);
        }, 300);
    };

    useEffect(() => {
        setTargetAreas(defaultWorkspace?.campaignSetting?.targetAreas || []);        
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [defaultWorkspace]);
    return (
        <Formik
            initialValues={{ gender: defaultWorkspace.campaignSetting?.gender || "All" }}
            validationSchema={Yup.object({
                gender: Yup.string().required("Gender is required"),
            })}
            onSubmit={handleSubmit}
            key={defaultWorkspace?.id}
        >
            {() => (
                <Form>
                    <div className="mb-40">
                        <h3 className="card-title gradient-title mb-4">Select Gender</h3>
                        <div className="d-flex align-items-center gap-4">
                            {["All", "Male", "Female"].map((gender) => (
                                <label key={gender} className="form-check-label ff-semibold" htmlFor={gender}>
                                    <Field
                                        className="form-check-input me-10 mt-0"
                                        id={gender}
                                        type="radio"
                                        name="gender"
                                        value={gender}
                                    />
                                    {gender}
                                </label>
                            ))}
                        </div>
                        <ErrorMessage name="gender" component="div" className="text-danger mt-2" />
                    </div>

                    <div className="mb-40">
                        <h3 className="card-title gradient-title mb-12">Target Areas</h3>
                        <p className="text-lightgray mb-4">
                            Your ad will be shown in this area. It could be a list of Local Area/City/State or PAN India.
                        </p>

                        <label htmlFor="targetArea" className="form-label">Select Target Area</label>
                        <div className="targetArea-section position-relative">
                            <input
                                type="text"
                                className="form-control"
                                list="cityOptions"
                                value={targetAreaInput}
                                onChange={handleQueryChange}
                                placeholder="Enter city"
                            />
                            <datalist id="cityOptions">
                                {allCities.map((cityState, index) => (
                                    <option key={index} value={cityState} />
                                ))}
                            </datalist>
                            <button type="button" className="btn btn-outline-primary" onClick={handleAddArea}>
                                <i className="fa fa-plus me-2"></i>Add
                            </button>
                        </div>

                        <div className="area-container mt-3">
                            {targetAreas.length > 0 ? (
                                targetAreas.map((area, index) => (
                                    <span key={index} className="areaCard">
                                        {area}
                                        <i
                                            className="bi bi-x fs-3 text-primary ms-2 cursor-pointer"
                                            onClick={() => handleRemoveArea(area)}
                                            title="Remove"
                                        ></i>
                                    </span>
                                ))
                            ) : (
                                <p className="text-muted">No target areas selected.</p>
                            )}
                        </div>
                    </div>

                    <div className="text-center text-md-start">
                        <button type="submit" className="btn btn-primary d-inline-flex">
                            Save
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default CampaignSettingTab;
