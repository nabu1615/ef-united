export const uploadFileHandler = async (file) => {
  const endpoint = process.env.NEXT_PUBLIC_EP || "";
  const token = process.env.NEXT_PUBLIC_TK || "";
  // hygraph file upload with createAsset
  const form = new FormData();

  form.append("fileUpload", file);

  const response = await fetch(`${endpoint}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  const { id } = await response.json();

  return id;
};
