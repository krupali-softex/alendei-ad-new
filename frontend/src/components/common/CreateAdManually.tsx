import React from "react";
import AdForm from "./AdForm";

const CreateAdManually: React.FC = () => {
  return (
    <div className="content p-0 my-5">
      <div className="container campaign-box">
        <h1 className="section-title mb-10">
          Manual Details,{" "}
          <span className="ff-bold text-primary">Massive Ad Results.</span>
        </h1>
        <p>
          Customize every detail, optimize your strategy, and watch your ads
          achieve remarkable performance.
        </p>
      </div>
      <AdForm />
    </div>
  );
};

export default CreateAdManually;
