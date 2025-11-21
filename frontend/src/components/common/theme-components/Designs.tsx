import React from "react";
import { useNavigate } from "react-router-dom";
import { fetchBackgroundImage } from "../../../services/apiService";

type DesignsProps = {};

const Designs: React.FC<DesignsProps> = ({}) => {
  const navigate = useNavigate();

  //  const [designs, setDesigns] = useState<any[]>([]); // Adjust type as needed
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const getDesigns = async () => {
  //     const params: GetAiImageParams = {
  //       businessName: "Sample Business",
  //       category: "Sample Category",
  //       city: "Sample City",
  //     };

  //     try {
  //       const res = await getAiImage(params);
  //       setDesigns(res?.data || []); // Adjust based on actual API shape
  //     } catch (err) {
  //       console.error("Error fetching designs:", err);
  //       setError("Failed to load designs. Please try again later.");
  //     }
  //   };

  //   getDesigns();
  // }, []);

  const handleNavigate = async (url: string) => {
    if (!url) return;
    let objectUrl = "";
    try {
      const res = await fetchBackgroundImage({ url });
      if (res) {
        objectUrl = URL.createObjectURL(res);
      } else {
        console.error("Invalid background image data");
      }
    } catch (error) {
      console.error("Error fetching background image:", error);
    } finally {
      navigate("editor", { state: { selectedDesignURL: objectUrl } });
    }
  };
  return (
    <div className="content p-0 my-5">
      <div className="container">
        <div className="table-card p-4 ">
          <div className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <h3 className="card-subtitle mb-40">Editors Choice</h3>
            </div>
            <div className="row g-4">
              <div className="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 col-6">
                <img
                  src="https://ads.alendei.com/images/design1.webp"
                  alt="design1"
                  className="w-100 h-auto cursor-pointer"
                  onClick={() =>
                    handleNavigate(
                      "https://ads.alendei.com/images/design1.webp"
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Designs;
