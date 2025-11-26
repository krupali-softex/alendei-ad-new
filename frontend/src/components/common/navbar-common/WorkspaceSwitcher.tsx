import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { useWorkspaceSwitcher } from "../../../hooks/workspace/useWorkspaceSwitcher";

const WorkspaceSwitcher: React.FC = () => {
  const workspaces = useSelector(
    (state: RootState) => state.workspace.allWorkspaces
  );
  const currentWorkspaceId = useSelector(
    (state: RootState) => state.workspace.defaultWorkspace?.id
  );
  const { handleSwitchWorkspace } = useWorkspaceSwitcher();

  return (
    <>
      <div
        className="dropdown-menu dropdown-caret dropdown-menu-end p-0 mt-1"
        aria-labelledby="navbarDropdownWorkspace"
      >
        {/* <h6 className="dropdown-header text-muted sticky-top bg-white" style={{ zIndex: 1 }}>Workspaces</h6> */}

        <div>
          {workspaces?.length > 0 &&
            workspaces.map((ws) => (
              <button
                key={ws.id}
                className={`dropdown-item d-flex align-items-center gap-3 px-3 py-2 border-bottom-grey ${
                  ws.id === currentWorkspaceId ? "active" : ""
                }`}
                onClick={() => handleSwitchWorkspace(ws.id)}
              >
                <img
                  src={
                    ws.imageUrl
                      ? ws.imageUrl
                      : "https://ads.alendei.com/images/workspace.webp"
                  }
                  alt={ws.name}
                  width="35"
                  height="30"
                />
                <span className="ff-medium f-16">{ws.name}</span>
              </button>
            ))}
        </div>
      </div>
    </>
  );
};

export default WorkspaceSwitcher;
