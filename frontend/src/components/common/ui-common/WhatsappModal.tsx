import React, { useEffect, useState } from "react";

type WhatsappModalProps = {
    isOpen: boolean;
    onClose: () => void;
    name: string;
    phone: string;
};

const WhatsappModal: React.FC<WhatsappModalProps> = ({
    isOpen,
    onClose,
    name,
    phone,
}) => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (isOpen) {
            setMessage(""); // reset message when modal opens
        }
    }, [isOpen]);

    const handleSend = () => {
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
                    <h5 className="modal-title">Send WhatsApp Message</h5>
                    <button
                        type="button"
                        className="btn-close"
                        onClick={onClose}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="modal-body">
                    <p>
                        <strong>Name:</strong> {name}
                    </p>
                    <p>
                        <strong>Phone:</strong> {phone}
                    </p>
                    <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="modal-footer d-flex justify-content-end gap-2">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleSend}
                        disabled={!message.trim()}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsappModal;
