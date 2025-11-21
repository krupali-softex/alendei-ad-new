const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const getThemeImages = async (businessCategory) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Prefix: `${businessCategory}/`,
  };

  try {
    const data = await s3.listObjectsV2(params).promise();
    console.log(data);
    const images = data.Contents.filter((item) => !item.Key.endsWith("/")).map(
      (item) => ({
        url: `https://${params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${item.Key}`,
        key: item.Key,
      })
    );
    return images;
  } catch (error) {
    console.error("Error fetching images from S3:", error);
    throw error;
  }
};

module.exports = { getThemeImages };

