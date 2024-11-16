import { client } from "@/sanity/lib/client";

export const uploadFileHandler = async (file) => {
  try {
    const response = await client.assets.upload("image", file);
<<<<<<< Updated upstream
    return response._id;
=======

    return response;
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw error;
  }
};
