// src/components/common/ConfirmDeleteModal.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ModalWrapper from "../../common/ui-common/ModalWrapper";

interface Props {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    workspaceName?: string;
}

const validationSchema = Yup.object({
    confirmText: Yup.string()
        .oneOf(["DELETE"], 'You must type "DELETE" to confirm')
        .required("Required"),
});

const ConfirmDeleteModal: React.FC<Props> = ({
  show,
  onClose,
  onConfirm,
  workspaceName = "",
}) => {
  return (
    <ModalWrapper
      isOpen={show}
      onClose={onClose}
      title="Confirm Delete Workspace"
      centered
      size="lg"
      role="dialog"
      disableBackdropClose
    >
      <p>
        Are you sure you want to delete the workspace{" "}
        <strong>{workspaceName}</strong> ?
      </p>
      <p className="text-danger mt-3 mb-2">
        Please type <strong>DELETE</strong> to confirm.
      </p>

      <Formik
        initialValues={{ confirmText: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          if (values.confirmText !== "DELETE") return;
          onConfirm();
          resetForm();
          onClose();
        }}
      >
        {({ isValid, dirty }) => (
          <Form>
            <Field
              name="confirmText"
              className="form-control mb-2"
              placeholder="Type DELETE"
              autoFocus
            />
            <ErrorMessage
              name="confirmText"
              component="div"
              className="text-danger small mb-3"
            />

            <div className="border-0 d-flex justify-content-center gap-2 pb-6 mt-3">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-danger"
                disabled={!(isValid && dirty)}
              >
                Delete
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </ModalWrapper>
  );
};


export default ConfirmDeleteModal;
