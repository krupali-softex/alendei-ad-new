import React from "react";
import AdForm from "./AdForm";

const CreateAdManually: React.FC = () => {
  return (
    <div className="content p-0 my-5">
      <div className="container campaign-box">
        <h1 className="section-title gradient-title gradient-primary mb-3">
          Manually add your campaign details
        </h1>
        <p>make your ad campaign manually with your strategies.</p>
      </div>
      <AdForm />
    </div>
  );
};

export default CreateAdManually;
