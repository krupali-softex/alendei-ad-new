import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { useMemo } from "react";
import { Link } from "react-router-dom";

const AdCampaignTracker = () => {
  const adFormData = useSelector((state: RootState) => state.adForm);

  // Build base steps
  const rawSteps = useMemo(() => [
    {
      title: "Your Company Name",
      value: adFormData.companyName,
      editable: true,
    },
    {
      title: "Category",
      value: adFormData.category,
    },
    {
      title: "Ad campaign type",
      value: adFormData.campaignType,
    },
    {
      title: "Date Range",
      value: adFormData.adDuration,
    },
    {
      title: "Budget",
      value: adFormData.budget
        ? `${adFormData.budget} (Life time)`
        : "",
    },
    {
      title: "Selected Platform",
      value: adFormData.selectPlatform
    },
    {
      title: "Target Areas",
      value: adFormData.targetArea || adFormData.targetAreas.join(", "),
    },
    {
      title: "Age Range",
      value: adFormData.ageRange[0] + " - " + adFormData.ageRange[1],
    },
    {
      title: "Gender",
      value: adFormData.gender,
    },


  ], [adFormData]);

  // Add status before mount using useMemo
  const stepsWithStatus = useMemo(() => {
    let statusAssigned = false;

    return rawSteps.map((step) => {
      if (step.value && !statusAssigned) {
        return { ...step, status: "completed" };
      } else if (!statusAssigned) {
        statusAssigned = true;
        return { ...step, status: "intransit" };
      } else {
        return { ...step, status: "pending" };
      }
    });
  }, [rawSteps]);

  return (
    <div className="col-xl-4 col-lg-5 col-md-12">
      <div className="campaign-card ai-ad-flow-campaign p-40">
        <h1 className="section-title gradient-title gradient-primary mb-2 text-start">
          Your Ad Campaign is Almost Ready...!
        </h1>
        <p className="text-start ff-semibold">Please, complete steps!</p>

        <div className="tracking-list mt-5">
          {stepsWithStatus.map((step) => (
            <div className={`tracking-item ${step.status}`} key={step.title}>
              <div
                className={`tracking-icon ${step.status === "completed"
                  ? "status-completed"
                  : step.status === "intransit"
                    ? "blinker"
                    : ""
                  }`}
              ></div>
              <div className="tracking-content">
                <p className="ff-bold text-black track-title">{step.title}</p>
                {step.status === "completed" && (
                  <span className="d-flex gap-2 align-items-baseline track-subtitle">
                    <p className="text-black">{step.value}</p>
                    {step.editable && <i className="bi bi-pencil-fill"></i>}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="track-button d-flex justify-content-center mt-5">
          {adFormData.setupCompleted ? (
            <Link to="/designs" className="btn btn-secondary">
              Next
            </Link>
          ) : (
            <button className="btn btn-secondary" disabled>
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdCampaignTracker;
