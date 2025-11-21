import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";

const FacebookPageSwitcher: React.FC = () => {
  const linkedPages = useSelector((state: RootState) => state.workspace.defaultWorkspace?.linkedPages);

  return (
    <>
      <div
        className="dropdown-menu dropdown-caret dropdown-menu-end"
        aria-labelledby="navbarDropdownWorkspace"
      >
        <h6 className="dropdown-header text-muted sticky-top bg-white" style={{ zIndex: 1 }}>Facebook Pages</h6>

        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {linkedPages && linkedPages?.length > 0 &&
            linkedPages.map((fbPage) => (
              <button
                key={fbPage.pageId}
                className={`dropdown-item d-flex align-items-center gap-3 px-4 py-3 border-bottom-grey ${fbPage.pageId === linkedPages[0].pageId ? "active" : ""
                  }`}
              >
                <img
                  src={fbPage.imageUrl ? fbPage.imageUrl : "https://ads.alendei.com/images/workspace.webp"}
                  alt={fbPage.name}
                  width="35"
                  height="30"
                />
                <span className="ff-medium f-16">{fbPage.name}</span>
              </button>
            ))}
          </div>
      </div>
    </>
  );
};

export default FacebookPageSwitcher;
