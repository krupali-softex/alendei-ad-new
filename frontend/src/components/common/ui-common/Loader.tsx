import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";

const Loader: React.FC = () => {
    const isLoading = useSelector((state: RootState) => state.loading.isLoading);

    if (!isLoading) return null;

    return (
        <div className="loader-overlay">
            <div className="loader">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
        </div>
    );
};

export default Loader;
