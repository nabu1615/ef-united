import { client } from "@/sanity/lib/client";

export const uploadFileHandler = async (file) => {
  try {
    const response = await client.assets.upload("image", file);
    return response._id;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};
