import React, { useEffect, useState } from "react";

type NotesModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: string) => void;
    leadName: string;
};

const NotesModal: React.FC<NotesModalProps> = ({
    isOpen,
    onClose,
    onSave,
    leadName,
}) => {
    const [note, setNote] = useState("");

    useEffect(() => {
        if (isOpen) {
            setNote(""); // Reset note on modal open
        }
    }, [isOpen]);

    const handleSave = () => {
        onSave(note);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            className="modal-backdrop d-flex justify-content-center align-items-center"
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0, 0, 0, 0.5)",
                zIndex: 1050,
            }}
        >
            <div
                className="modal-content bg-white p-4 rounded shadow"
                style={{ width: "90%", maxWidth: "500px" }}
            >
                <div className="modal-header d-flex justify-content-between align-items-center">
                    <h5 className="modal-title">Add Note</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>

                <div className="modal-body">
                    <p>
                        <strong>Name:</strong> {leadName}
                    </p>
                    <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Write a note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </div>

                <div className="modal-footer d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={!note.trim()}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotesModal;
