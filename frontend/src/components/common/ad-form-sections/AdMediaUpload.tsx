import React, { useState } from "react";

type AdMediaUploadProps = {
  uploadedMedia: File[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
};

const AdMediaUpload: React.FC<AdMediaUploadProps> = ({
  uploadedMedia,
  handleFileUpload,
  handleRemoveFile,
}) => {
  const [videoThumbnails, setVideoThumbnails] = useState<{ [key: number]: string }>({});

  // Function to extract a random frame from a video file
  const generateVideoThumbnail = (file: File, index: number) => {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.crossOrigin = "anonymous";
    video.muted = true; // Mute to prevent autoplay issues
    video.currentTime = Math.random() * 5; // Capture a random frame from the first 5 seconds

    video.onloadeddata = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setVideoThumbnails((prev) => ({ ...prev, [index]: canvas.toDataURL("image/png") }));
      }
    };
  };

  return (
    <div className="row g-20 mt-0">
      <div className="col-lg-12">
        <div className="campaign-card">
          <div className="row g-20 align-items-center">
            <div className="col-lg-6">
              <h3 className="card-title gradient-title mb-2">Ad Campaign Details</h3>
              <p>You can upload images, videos, or multiple files for your ad campaign!</p>
            </div>
            <div className="col-lg-6">
              <div className="custom-fileUpload">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg, image/png, image/gif, image/webp, video/mp4, video/webm, video/ogg"
                  onChange={(e) => {
                    handleFileUpload(e);
                    // Generate thumbnails for videos
                    Array.from(e.target.files || []).forEach((file, index) => {
                      if (file.type.startsWith("video/")) {
                        generateVideoThumbnail(file, uploadedMedia.length + index);
                      }
                    });
                  }}
                />
                <div className="custom-upload-design d-flex align-items-center justify-content-between">
                  <div className="upload-text">
                    <img src="https://ads.alendei.com/images/file-upload.svg" className="me-3" alt="Upload Icon" />
                    Drop your Video or Image
                  </div>
                  <span className="text-primary text-decoration-underline">or</span>
                  <span className="btn btn-primary">Upload a file</span>
                </div>
              </div>

              {/* Display Uploaded Files with Previews */}
              <div className="filename-wrapper d-flex flex-wrap gap-3">
                {uploadedMedia.map((file, index) => {
                  const isImage = file.type.startsWith("image/");
                  const isVideo = file.type.startsWith("video/");
                  return (
                    <div key={index} className="preview-container mt-3 position-relative">
                      {isImage ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="preview-img rounded"
                          style={{ width: 100, height: 100, objectFit: "cover" }}
                        />
                      ) : isVideo ? (
                        <img
                          src={videoThumbnails[index] || "https://cdn-icons-png.flaticon.com/512/2611/2611310.webp"}
                          alt="Video Thumbnail"
                          className="preview-img rounded"
                          style={{ width: 100, height: 100, objectFit: "contain" }}
                        />
                      ) : (
                        <p className="file-name">{file.name}</p>
                      )}
                      <i
                        className="bi bi-x text-danger position-absolute top-0 end-0 fs-3 cursor-pointer"
                        role="button"
                        onClick={() => handleRemoveFile(index)}
                      ></i>


                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdMediaUpload;
