import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { setLoading } from "../../../state/slices/loadingSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUser, uploadImage } from "../../../services/apiService";
import * as Types from "../../../types";

import { useSession } from "../../../hooks/session/useSession";

type userDataProps = {
  user: Types.User 
}

const UserProfile:React.FC<userDataProps> = ( {user}) => {

  const dispatch = useDispatch();
      const { fetchSession } = useSession();
  
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<string>("https://ads.alendei.com/images/user.webp");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const initialValues = {
    username: user?.username || "",
    imageUrl: user?.imageUrl || "",
  };

useEffect(() => {
    if (user?.imageUrl) {
      setImage(user.imageUrl);
    }
  }, [user]);


  const saveChanges = async (data: Types.userFormData) => {
    let isSessionNeedsUpdate = false;
    try {
      dispatch(setLoading(true));
      try {
        if (imageFile) {
          const res = await uploadImage(imageFile, "upload-profile-pic");
          if (res.success) {
            setImage(res.imageUrl);
          } else {
            toast.error(res.message || "Image upload failed.");
          }
        }
        const res = await updateUser({ newUsername: data.username });
        if (res.success) {
          toast.success("Profile updated successfully.");
          isSessionNeedsUpdate = true;
        } else {
          toast.error(res.message || "Failed to update profile.");
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Error while updating profile.");
      }

    } finally {
      dispatch(setLoading(false));
      imageFile && setImageFile(null);
      setIsEditing(false);
      isSessionNeedsUpdate && fetchSession();

    }
  };


  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imgURL = URL.createObjectURL(event.target.files[0]);
      setImage(imgURL);
      setImageFile(event.target.files[0]);
    }
  };


  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters")
      .required("Name is required"),

  });

  return (
    <>
      <div
        className={`p-5 p-lg-3 table-card text-center ${isEditing ? "shadow-lg" : ""}`}
      >
        <div className="user-profile position-relative mb-30">
          <img src={image} alt="user" />
          {isEditing && (
            <>
              <label htmlFor="fileInput" className="edit-overlay">
                <i className="bi bi-pencil-fill edit-icon"></i>
              </label>
              <input
                type="file"
                id="fileInput"
                className="d-none"
                accept="image/*"
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        {isEditing ? (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(touched) => {
              setIsEditing(false); 
              saveChanges(touched);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <Field
                    type="text"
                    name="username"
                    className={`form-control text-center ${touched.username && errors.username ? "is-invalid" : ""}`}
                    placeholder="Enter Name"
                  />
                  <ErrorMessage name="username" component="div" className="invalid-feedback" />
                </div>

                <button type="submit" className="btn btn-sm btn-outline-primary d-inline-flex align-items-center">
                  <i className="bi bi-check"></i>
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="btn btn-sm btn-outline-danger ms-2 d-inline-flex align-items-center"
                >
                  <i className="bi bi-x" onClick={() => {
                    setIsEditing(false)
                    setImage(user.imageUrl || "https://ads.alendei.com/images/user.webp");
                  }} ></i>
                </button>

              </Form>
            )}
          </Formik>
        ) : (
          <div>
            <h3 className="username mb-3">{initialValues.username}</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline-primary d-inline-flex"
            >
              Edit
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default UserProfile;
