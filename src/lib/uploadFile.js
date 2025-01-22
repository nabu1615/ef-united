export const uploadFileHandler = async (file) => {
  const strapiHost = process.env.NEXT_PUBLIC_STRAPI_HOST;
  const strapiToken = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  const formData = new FormData();
  formData.append("files", file);

  try {
    const response = fetch(`${strapiHost}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${strapiToken}`,
      },
      body: formData,
    });

    return response.then((res) => {
      return res.json();
    });
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};
