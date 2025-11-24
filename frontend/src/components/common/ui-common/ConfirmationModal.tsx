import React from "react";

type ConfirmationModalProps = {
  id: string;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  id,
  title,
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  return (
    <div
      className="modal fade"
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content logout-modal">
          <div className="modal-header border-0 pb-0 position-relative">
            <h5
              className="ff-semibold w-100 text-center text-black"
              id={`${id}Label`}
            >
              {title}
            </h5>
          </div>

          <div className="modal-body text-center">
            <p className="text-secondary">{message}</p>
          </div>

          <div className="modal-footer border-0 d-flex justify-content-center gap-3 pb-4">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              data-bs-dismiss="modal"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
