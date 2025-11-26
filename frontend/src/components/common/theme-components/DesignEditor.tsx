import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { DesignElement } from "../../../types";
import html2canvas from "html2canvas";
import { setLoading } from "../../../state/slices/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  createOrder,
  verifyPayment,
  saveAd,
} from "../../../services/apiService";
import * as Types from "../../../types/index";
import AdPreviewModal from "../ui-common/AdPreviewModal";

type DesignsDetailsProps = {};

const DesignsDetails: React.FC<DesignsDetailsProps> = ({}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const adFormData = useSelector((state: RootState) => state.adForm);
  const pages = useSelector(
    (state: RootState) => state.workspace.defaultWorkspace.linkedPages
  );
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const designUrl = location.state?.selectedDesignURL;
  const [showModal, setShowModal] = useState(false);
  const [facebookAdPreview, setFacebookAdPreview] =
    useState<Types.AdPreviewDetails>({
      pageName: "",
      profileImage: "https://ads.alendei.com/images/add-profile.webp",
      adTitle: "",
      adDescription: "",
      adImage: "",
      likes: 200,
    });
  const [instagramAdPreview, setInstagramAdPreview] =
    useState<Types.AdPreviewDetails>({
      pageName: "",
      profileImage: "https://ads.alendei.com/images/add-profile.webp",
      adTitle: "",
      adDescription: "",
      adImage: "",
      likes: 200,
    });

  const [logo, setLogo] = useState<{
    url: string;
    x: number;
    y: number;
    width: number;
  }>({
    url: "",
    x: 100,

    y: 100,
    width: 150,
  });
  const [background, setBackground] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);
    if (designUrl) {
      setBackground(designUrl);
    }
  }, []);

  /* INITIATE AD CREATION SECTION START */

  const validateAdFormData = (adForm: Types.AdFormState): boolean => {
    return !adForm.companyName.trim() ||
      !adForm.campaignType.trim() ||
      !adForm.scheduleStartDate.trim() ||
      !adForm.scheduleStartTime.trim() ||
      !adForm.scheduleEndTime.trim() ||
      !adForm.selectPlatform.trim() ||
      !adForm.gender.trim() ||
      !adForm.targetAreas ||
      !Array.isArray(adForm.targetAreas) ||
      adForm.targetAreas.length === 0 ||
      !adForm.ageRange ||
      adForm.ageRange.length !== 2 ||
      !adForm.budget ||
      adForm.budget <= 0
      ? false
      : true;
  };

  const transformAdFormToMetadata = (
    adForm: Types.AdFormState
  ): Types.SaveAdMetadata => {
    return {
      campaignName: adForm.companyName || "My Campaign",
      ad_objective: adForm.campaignType.toLowerCase(),
      lifetime_budget: adForm.budget,
      age_min: adForm.ageRange[0],
      age_max: adForm.ageRange[1],
      gender: adForm.gender.toLowerCase(),
      publisher_platform: adForm.selectPlatform.toLowerCase(),
      geo_location: adForm.targetAreas.length ? adForm.targetAreas[0] : "INDIA",
      destinationUrl: adForm.websiteURL || "",
      start_date: adForm.scheduleStartDate,
      end_date: adForm.scheduleEndDate || adForm.scheduleStartDate,
      starttime: adForm.scheduleStartTime,
      endtime: adForm.scheduleEndTime,
    };
  };

  async function captureDivAsFile(divId: string): Promise<File | null> {
    const div = document.getElementById(divId);
    if (!div) return null;

    const canvas = await html2canvas(div, {
      useCORS: true,
      backgroundColor: null,
      scale: 2,
    });

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "edited-design.png", {
            type: blob.type,
          });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  }

  const saveAdDraft = async (): Promise<void> => {
    dispatch(setLoading(true));
    try {
      const file = await captureDivAsFile("design-area");
      if (!file) {
        toast.error("Failed to capture design. Please try again.");
        return;
      }
      const adMetadata = transformAdFormToMetadata(adFormData);
      const res = await saveAd(file, adMetadata);
      if (res && res.draftId) {
        toast.success("Ad draft saved successfully!");
      } else {
        toast.error("Failed to save ad draft.");
      }
    } catch (error) {
      console.error("Error saving ad draft:", error);
      toast.error("Oops! Something went wrong while saving the ad.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const proceedToPayment = async (): Promise<void> => {
    const isFormValid = validateAdFormData(adFormData);
    if (!isFormValid) {
      toast.error(
        "Please complete the form or take help from AI form assistant."
      );
      return;
    }
    await saveAdDraft();
    handlePayment();
  };
  const handlePayment = async () => {
    if (!razorpayLoaded) {
      toast.warn("Razorpay is still loading. Please try again.");
      return;
    }
    dispatch(setLoading(true));
    try {
      const params = { amount: adFormData.budget };
      const orderData = await createOrder(params);
      if (!orderData.id) {
        toast.error("Oops! Something went wrong.");
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZOR_PAY_KEY,
        amount: orderData.amount,
        currency: "INR",
        name: "My Business",
        description: "Test Transaction",
        order_id: orderData.id,
        handler: async (response: any) => {
          const verifyDataParams = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };
          const verifyData = await verifyPayment(verifyDataParams);
          navigate("/grow");
          if (verifyData.success) {
            toast.success("Payment Verified Successfully!");
          } else {
            toast.error("Payment Verification Failed!");
          }
        },
        theme: { color: "#069B49" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Oops! Something went wrong.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* INITIATE AD CREATION SECTION END */

  const systemFonts = [
    "Poppins, sans-serif",
    "Nunito, sans-serif",
    "Manrope, sans-serif",
    "Arial, sans-serif",
    "Verdana, sans-serif",
    "Tahoma, sans-serif",
    "Times New Roman, serif",
    "Georgia, serif",
    "Courier New, monospace",
    "Trebuchet MS, sans-serif",
    "Comic Sans MS, sans-serif",
    "Lucida Console, monospace",
    "Garamond, serif",
    "Impact, sans-serif",
    "Palatino Linotype, serif",
    "Segoe UI, sans-serif",
    "Helvetica, sans-serif",
    "Calibri, sans-serif",
    "Cambria, serif",
  ];

  const [elements, setElements] = useState<DesignElement[]>([
    {
      id: 1,
      type: "text",
      x: 10,
      y: 10,
      text: "Text 1",
      fontSize: 32,
      fontFamily: systemFonts[0],
      color: "#000000",
      isBold: false,
    },
    {
      id: 2,
      type: "text",
      x: 100,
      y: 50,
      text: "Text 2",
      fontSize: 24,
      fontFamily: systemFonts[0],
      color: "#000000",
      isBold: false,
    },
  ]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogo({ url: imageUrl, x: 100, y: 100, width: 150 });
    }
  };
  const handleLogoDragStop = (_: any, data: { x: number; y: number }) => {
    setLogo((prev) => ({ ...prev, x: data.x, y: data.y }));
  };
  const handleBackgroundUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBackground(imageUrl);
    }
  };

  const handleDragStop = (id: number, data: { x: number; y: number }) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: data.x, y: data.y } : el))
    );
  };

  const handleTextChange = (id: number, value: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, text: value } : el))
    );
  };

  const handleFontSizeChange = (id: number, increase: boolean) => {
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              fontSize: increase
                ? el.fontSize
                  ? el.fontSize + 2
                  : 2
                : Math.max(10, el.fontSize ? el.fontSize - 2 : 2),
            }
          : el
      )
    );
  };

  const handleFontFamilyChange = (id: number, fontFamily: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, fontFamily } : el))
    );
  };

  const handleColorChange = (id: number, color: string) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, color } : el))
    );
  };

  const toggleStyle = (id: number, style: keyof (typeof elements)[0]) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, [style]: !el[style] } : el))
    );
  };

  const handleAlignmentChange = (
    id: number | null,
    alignment: "left" | "center" | "right" | "justify"
  ) => {
    if (id === null) return; // Ensure there's an active text selection
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, textAlign: alignment } : el))
    );
  };

  const addTextElement = () => {
    const newElement: DesignElement = {
      id: Date.now(),
      type: "text",
      x: 50,
      y: 50,
      text: "New Text",
      fontSize: 24,
      fontFamily: "Arial",
      color: "#000000",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      textAlign: "left",
    };

    setElements((prev) => [...prev, newElement]);
  };
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newElement: DesignElement = {
        id: Date.now(),
        type: "image",
        x: 250,
        y: 250,
        imageUrl,
        width: 150,
        height: 150,
        rotate: 0,
        opacity: 1,
      };
      setElements((prev) => [...prev, newElement]);
    }
  };

  const downloadAsImage = async () => {
    const designArea = document.getElementById("design-area");
    if (!designArea) return;
    try {
      dispatch(setLoading(true));
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const canvas = await html2canvas(designArea);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `design-${timestamp}.png`;
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const removeTextElement = (id: number) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };
  const removeImageElement = (id: number) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleResize = (id: number, action: "increase" | "decrease") => {
    setElements((prevElements) =>
      prevElements.map((el) => {
        if (el.id !== id) return el;

        let newWidth = el.width ? el.width : 0;
        let newHeight = el.height ? el.height : 0;

        if (action === "increase") {
          newWidth += 10;
          newHeight += 10;
        } else if (action === "decrease") {
          newWidth = Math.max(10, newWidth - 10);
          newHeight = Math.max(10, newHeight - 10);
        }

        return { ...el, width: newWidth, height: newHeight };
      })
    );
  };

  const handlePreviewAd = async () => {
    let fbAdImage: File | null = null;
    try {
      dispatch(setLoading(true));
      fbAdImage = await captureDivAsFile("design-area");
      if (fbAdImage) {
        facebookAdPreview.adImage = URL.createObjectURL(fbAdImage);
        instagramAdPreview.adImage = URL.createObjectURL(fbAdImage);
        setFacebookAdPreview({
          ...facebookAdPreview,
          adImage: URL.createObjectURL(fbAdImage),
          adDescription: adFormData.campaignMessage,
          adTitle: adFormData.companyName,
          pageName: pages?.length ? pages[0].name : "Facebook Ad",
        });
        setInstagramAdPreview({
          ...facebookAdPreview,
          adImage: URL.createObjectURL(fbAdImage),
          adDescription: adFormData.campaignMessage,
          adTitle: adFormData.companyName,
          pageName: pages?.length ? pages[0].name : "Instagram Ad",
        });
      }
    } catch (error) {
      toast.error("Failed to capture design for preview. Please try again.");
    } finally {
      setShowModal(true);
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div className="content p-0 my-5" onClick={() => setEditingId(null)}>
        <div className="container">
          <div className="table-card p-5">
            {/* Design4 Page- Just for reference */}
            <div>
              {/* Text-Editor */}
              <div className="img-design-details">
                {/* Toolbar */}
                <div className="d-flex align-items-center flex-wrap gap-3 mb-5 justify-content-between">
                  <div className="toolbar d-flex align-items-center flex-wrap gap-10">
                    <Link
                      to="/designs"
                      className="btn btn-outline-primary btn-toolbar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          d="M4.28594 9.79541L9.88594 15.3954L8.46094 16.7954L0.460938 8.79541L8.46094 0.79541L9.88594 2.19541L4.28594 7.79541H16.4609V9.79541H4.28594Z"
                          fill="#205DAD"
                        />
                      </svg>
                    </Link>

                    <div className="toolbar d-flex align-items-center flex-wrap gap-10">
                      {editingId === null && (
                        <>
                          <div
                            className="btn btn-outline-secondary px-3"
                            onClick={() =>
                              document.getElementById("logoUpload")?.click()
                            }
                          >
                            <input
                              id="logoUpload"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoUpload}
                              style={{ display: "none" }}
                            />
                            <i className="bi bi-plus-lg me-2"></i>Upload logo
                          </div>
                          <button
                            className="btn btn-outline-secondary px-3"
                            onClick={() =>
                              document
                                .getElementById("backgroundUpload")
                                ?.click()
                            }
                          >
                            <input
                              onChange={handleBackgroundUpload}
                              id="backgroundUpload"
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                            ></input>
                            <i className="bi bi-plus-lg me-2"></i>Upload
                            background
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-toolbar"
                            onClick={addTextElement}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M0.0546875 0.200684V5.98584H2.64214V2.78814H10.3557V20.8027H6.76742V23.3901H16.5314V20.8027H12.9431V2.78814H20.6567V5.98584H23.2441V0.200684H0.0546875Z"
                                fill="#585858"
                              />
                            </svg>
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-toolbar"
                            onClick={() =>
                              document.getElementById("generalImages")?.click()
                            }
                          >
                            <input
                              onChange={handleImageUpload}
                              id="generalImages"
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                            ></input>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="35"
                              height="24"
                              viewBox="0 0 35 24"
                              fill="none"
                            >
                              <path
                                d="M0.5 23.5591L11.0583 9.98417C12.2873 8.41999 14.2425 8.41999 15.4156 9.98417L23.5159 20.4307L25.7504 17.5817C26.9794 16.0175 28.9347 16.0175 30.1078 17.5817L34.8004 23.6149H0.5V23.5591Z"
                                fill="#585858"
                              />
                              <path
                                d="M29.5499 7.1906C31.5245 7.1906 33.1252 5.5899 33.1252 3.61532C33.1252 1.64075 31.5245 0.0400391 29.5499 0.0400391C27.5753 0.0400391 25.9746 1.64075 25.9746 3.61532C25.9746 5.5899 27.5753 7.1906 29.5499 7.1906Z"
                                fill="#585858"
                              />
                            </svg>
                          </button>{" "}
                        </>
                      )}

                      {/* <button className="btn redo-undo d-flex justify-content-center gap-2 py-1 px-3">
                    <i className="bi bi-arrow-counterclockwise"></i>
                    <div className="icon-separator"></div>
                    <i className="bi bi-arrow-clockwise" disabled></i>
                  </button> */}

                      {editingId !== null &&
                        elements.find((el) => el.id === editingId)?.type ===
                          "text" && (
                          <>
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="d-flex gap-2 text-editor align-items-center"
                            >
                              <select
                                className="form-select-lg"
                                value={
                                  elements.find((el) => el.id === editingId)
                                    ?.fontFamily || "Poppins"
                                }
                                onChange={(e) =>
                                  handleFontFamilyChange(
                                    editingId,
                                    e.target.value
                                  )
                                }
                              >
                                {systemFonts.map((font) => (
                                  <option
                                    key={font}
                                    value={font}
                                    style={{ fontFamily: font }}
                                  >
                                    {font}
                                  </option>
                                ))}
                              </select>
                              {/* Font Size Controls */}
                              <button
                                className="btn btn-outline-secondary py-1 px-3 d-flex gap-2"
                                onClick={() =>
                                  handleFontSizeChange(editingId, false)
                                }
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <span>
                                {
                                  elements.find((el) => el.id === editingId)
                                    ?.fontSize
                                }
                              </span>
                              <button
                                className="btn btn-outline-secondary py-1 px-3 d-flex gap-2"
                                onClick={() =>
                                  handleFontSizeChange(editingId, true)
                                }
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                              <div className="icon-separator"></div>

                              {/* Text Formatting Buttons */}
                              <button
                                className={
                                  "btn btn-link border-0 p-1 " +
                                  (elements.find((el) => el.id === editingId)
                                    ?.isBold
                                    ? "active"
                                    : "")
                                }
                                onClick={() => toggleStyle(editingId, "isBold")}
                              >
                                <i className="bi bi-type-bold"></i>
                              </button>
                              <button
                                className={
                                  "btn btn-link border-0 p-1 " +
                                  (elements.find((el) => el.id === editingId)
                                    ?.isItalic
                                    ? "active"
                                    : "")
                                }
                                onClick={() =>
                                  toggleStyle(editingId, "isItalic")
                                }
                              >
                                <i className="bi bi-type-italic"></i>
                              </button>
                              <button
                                className={
                                  "btn btn-link border-0 p-1 " +
                                  (elements.find((el) => el.id === editingId)
                                    ?.isUnderline
                                    ? "active"
                                    : "")
                                }
                                onClick={() =>
                                  toggleStyle(editingId, "isUnderline")
                                }
                              >
                                <i className="bi bi-type-underline"></i>
                              </button>
                              <button
                                className={
                                  "btn btn-link border-0 p-1 " +
                                  (elements.find((el) => el.id === editingId)
                                    ?.isStrikethrough
                                    ? "active"
                                    : "")
                                }
                                onClick={() =>
                                  toggleStyle(editingId, "isStrikethrough")
                                }
                              >
                                <i className="bi bi-type-strikethrough"></i>
                              </button>
                              <input
                                type="color"
                                value={
                                  elements.find((el) => el.id === editingId)
                                    ?.color || "#000000"
                                }
                                onChange={(e) =>
                                  handleColorChange(editingId, e.target.value)
                                }
                              />
                              <div className="icon-separator"></div>

                              {/* Text Alignment Buttons */}
                              {/* Text Alignment Buttons */}
                              <button
                                className={
                                  "btn btn-link border-0 p-1" +
                                  (elements.find((el) => el.id === editingId)
                                    ?.textAlign === "left"
                                    ? " active"
                                    : "")
                                }
                                onClick={() =>
                                  handleAlignmentChange(editingId, "left")
                                }
                              >
                                <i className="bi bi-text-left"></i>
                              </button>
                              <button
                                className={
                                  "btn btn-link border-0 p-1" +
                                  (elements.find((el) => el.id === editingId)
                                    ?.textAlign === "center"
                                    ? " active"
                                    : "")
                                }
                                onClick={() =>
                                  handleAlignmentChange(editingId, "center")
                                }
                              >
                                <i className="bi bi-text-center"></i>
                              </button>
                              <button
                                className={
                                  "btn btn-link border-0 p-1" +
                                  (elements.find((el) => el.id === editingId)
                                    ?.textAlign === "right"
                                    ? " active"
                                    : "")
                                }
                                onClick={() =>
                                  handleAlignmentChange(editingId, "right")
                                }
                              >
                                <i className="bi bi-text-right"></i>
                              </button>
                              <button
                                className={
                                  "btn btn-link border-0 p-1" +
                                  (elements.find((el) => el.id === editingId)
                                    ?.textAlign === "justify"
                                    ? " active"
                                    : "")
                                }
                                onClick={() =>
                                  handleAlignmentChange(editingId, "justify")
                                }
                              >
                                <i className="bi bi-justify"></i>
                              </button>
                            </div>
                          </>
                        )}
                      {editingId !== null &&
                        elements.find((el) => el.id === editingId)?.type ===
                          "image" && (
                          <>
                            <div
                              className="toolbar d-flex align-items-center flex-wrap gap-10"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="d-flex gap-2 text-editor align-items-center">
                                <button
                                  className="btn btn-link border-0 p-1"
                                  onClick={() =>
                                    handleResize(editingId, "decrease")
                                  }
                                >
                                  <i className="bi bi-dash"></i>
                                </button>
                                <div className="icon-separator"></div>
                                <button
                                  className="btn btn-link border-0 p-1"
                                  onClick={() =>
                                    handleResize(editingId, "increase")
                                  }
                                >
                                  <i className="bi bi-plus"></i>
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                  </div>

                  <div className="toolbar d-flex align-items-center flex-wrap gap-10">
                    <button
                      className="btn btn-primary btn-toolbar min-w-unset"
                      onClick={downloadAsImage}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="19"
                        height="23"
                        viewBox="0 0 19 23"
                        fill="none"
                      >
                        <path
                          d="M0.888672 22.6929H18.8379V20.1288H0.888672V22.6929ZM18.8379 8.58998H13.7095V0.897461H6.01702V8.58998H0.888672L9.86328 17.5646L18.8379 8.58998Z"
                          fill="white"
                        />
                      </svg>
                    </button>

                    {/* <button
                      type="button"
                      className="btn btn-outline-danger btn-toolbar"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="19"
                        viewBox="0 0 17 19"
                        fill="none"
                      >
                        <path
                          d="M3.95312 18.7954C3.40313 18.7954 2.93246 18.5997 2.54112 18.2084C2.14979 17.8171 1.95379 17.3461 1.95312 16.7954V3.79541H0.953125V1.79541H5.95312V0.79541H11.9531V1.79541H16.9531V3.79541H15.9531V16.7954C15.9531 17.3454 15.7575 17.8164 15.3661 18.2084C14.9748 18.6004 14.5038 18.7961 13.9531 18.7954H3.95312ZM5.95312 14.7954H7.95312V5.79541H5.95312V14.7954ZM9.95312 14.7954H11.9531V5.79541H9.95312V14.7954Z"
                          fill="#CA3E3E"
                        />
                      </svg>
                    </button> */}

                    <button
                      className="btn btn-light"
                      onClick={handlePreviewAd}
                      data-bs-target="#adPreviewModal"
                    >
                      Preview
                    </button>

                    <button
                      // className="btn btn-secondary"
                      // disabled={!validateAdFormData(adFormData)}
                      // onClick={() => {
                      //   proceedToPayment();
                      // }}

                      className={`btn btn-ad-ai ${
                        !validateAdFormData(adFormData) ? "disabled" : ""
                      }`}
                      onClick={(e) => {
                        if (!validateAdFormData(adFormData)) {
                          e.preventDefault(); // stop click
                          return;
                        }
                        proceedToPayment();
                      }}
                    >
                      Launch Campaign
                    </button>
                  </div>
                </div>
              </div>

              {/* Img */}
              <div className="d-flex justify-content-center">
                <div
                  id="design-area"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "relative",
                    width: "500px",
                    height: "500px",
                    background: background
                      ? `url(${background}) center/cover no-repeat`
                      : "#f5f5f5",
                    overflow: "hidden",
                  }}
                >
                  {logo.url && (
                    <Draggable
                      bounds="parent"
                      position={{ x: logo.x, y: logo.y }}
                      onStop={handleLogoDragStop}
                    >
                      <div style={{ position: "absolute", cursor: "move" }}>
                        <img
                          src={logo.url}
                          alt="Logo"
                          crossOrigin="anonymous"
                          style={{ width: `${logo.width}px`, height: "auto" }}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "5px",
                          }}
                        ></div>
                      </div>
                    </Draggable>
                  )}
                  {elements.map((el) => (
                    <Draggable
                      key={el.id}
                      bounds="parent"
                      position={{ x: el.x, y: el.y }}
                      onStop={(_, data) => handleDragStop(el.id, data)}
                    >
                      <div
                        style={{
                          position: "absolute",
                          cursor: "move",
                        }}
                        onClick={() => setEditingId(el.id)}
                      >
                        {/* Render Text Element */}
                        {el.type === "text" ? (
                          editingId === el.id ? (
                            <>
                              <textarea
                                value={el.text}
                                onChange={(e) =>
                                  handleTextChange(el.id, e.target.value)
                                }
                                autoFocus
                                className="form-control position-relative"
                                style={{
                                  fontSize: `${el.fontSize}px`,
                                  fontFamily: el.fontFamily,
                                  color: el.color,
                                  lineHeight: `${
                                    el.fontSize ? el.fontSize : 1 * 1.2
                                  }px`, // Line height based on font size
                                  width: "100%",
                                  height: "auto",
                                  overflow: "hidden",
                                  border: "1px dashed #CDCDCD",
                                  resize: "none",
                                  fontWeight: el.isBold ? "bold" : "normal",
                                  fontStyle: el.isItalic ? "italic" : "normal",
                                  textDecoration: `${
                                    el.isUnderline ? "underline" : ""
                                  } ${
                                    el.isStrikethrough ? "line-through" : ""
                                  }`.trim(),
                                }}
                                onInput={(e) => {
                                  const target =
                                    e.target as HTMLTextAreaElement;
                                  target.style.height = "auto"; // Reset height to recalculate
                                  target.style.height = `${target.scrollHeight}px`; // Set height to fit content
                                }}
                              />
                              <button
                                className="btn-close fs-7 p-1 position-absolute btn-delete-close"
                                onClick={() => removeTextElement(el.id)}
                              ></button>
                            </>
                          ) : (
                            <div
                              style={{
                                width: "auto",
                                height: "50px",
                                fontSize: `${el.fontSize}px`,
                                fontFamily: el.fontFamily,
                                textAlign: el.textAlign || "left",
                                color: el.color,
                                fontWeight: el.isBold ? "bold" : "normal",
                                fontStyle: el.isItalic ? "italic" : "normal",
                                textDecoration: `${
                                  el.isUnderline ? "underline" : ""
                                } ${
                                  el.isStrikethrough ? "line-through" : ""
                                }`.trim(),
                                lineHeight: `${
                                  el.fontSize ? el.fontSize : 1 * 1.2
                                }px`, // Line height based on font size
                              }}
                            >
                              {el.text}
                            </div>
                          )
                        ) : (
                          // Render Image Element
                          el.type === "image" &&
                          el.imageUrl && (
                            <div style={{ position: "relative" }}>
                              <img
                                src={el.imageUrl}
                                alt="Uploaded"
                                crossOrigin="anonymous"
                                style={{
                                  width: `${el.width}px`,
                                  height: `${el.height}px`,
                                  transform: `rotate(${el.rotate ?? 0}deg)`,
                                  opacity: el.opacity ?? 1,
                                }}
                              />
                              {editingId === el.id && (
                                <button
                                  className="btn-close fs-7 p-1 position-absolute btn-delete-close"
                                  onClick={() => removeImageElement(el.id)} // works for both text and image
                                  style={{ top: "-8px", right: "-8px" }}
                                ></button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </Draggable>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdPreviewModal
        facebookAd={facebookAdPreview}
        instagramAd={instagramAdPreview}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default DesignsDetails;
