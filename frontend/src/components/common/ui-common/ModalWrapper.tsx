import React, { useEffect, useRef } from "react";
import Modal from "bootstrap/js/dist/modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  footer?: React.ReactNode;
  size?: "sm" | "lg" | "xl";
  centered?: boolean;
  disableBackdropClose?: boolean;
  additionalClasses?: string;
  role?: string;
  style?: React.CSSProperties;
  contentClassName?: string; // ✅ added for flexibility
}

const ModalWrapper: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  footer,
  size,
  centered = false,
  disableBackdropClose = false,
  additionalClasses = "",
  role = "dialog",
  style,
  contentClassName, 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstance = useRef<any>(null);

  // Initialize Bootstrap modal instance
  useEffect(() => {
    if (modalRef.current) {
      if (!modalInstance.current) {
        modalInstance.current = Modal.getOrCreateInstance(modalRef.current, {
          backdrop: disableBackdropClose ? "static" : true,
          keyboard: !disableBackdropClose,
        });
      }
    }
    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
        modalInstance.current = null;
      }
    };
  }, [disableBackdropClose]);

  // Show/hide based on isOpen prop
  useEffect(() => {
    if (modalInstance.current) {
      if (isOpen) {
        modalInstance.current.show();
      } else {
        modalInstance.current.hide();
      }
    }
  }, [isOpen]);

  // Bootstrap close event
  useEffect(() => {
    const modalEl = modalRef.current;
    if (!modalEl) return;

    const handleHide = () => onClose();
    modalEl.addEventListener("hidden.bs.modal", handleHide);

    return () => {
      modalEl.removeEventListener("hidden.bs.modal", handleHide);
    };
  }, [onClose]);

  return (
    <div
      className={`modal fade ${additionalClasses}`}
      tabIndex={-1}
      ref={modalRef}
      aria-hidden="true"
      role={role}
      aria-labelledby={title ? "modal-title" : undefined} // ✅ accessibility improvement
      style={style}
    >
      <div
        className={`modal-dialog ${size ? `modal-${size}` : ""} ${centered ? "modal-dialog-centered" : ""
          }`}
      >
        <div className={`modal-content ${contentClassName || "p-5 pt-4"}`}>
          {title && (
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h5
                id="modal-title" // ✅ linked with aria-labelledby
                className="modal-title f-24 ff-semiBold text-black"
              >
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          )}
          {children}
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
