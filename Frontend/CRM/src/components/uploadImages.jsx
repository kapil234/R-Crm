const url = `https://api.cloudinary.com/v1_1/${import.meta.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/raw/upload`;

const uploadImage = async (file) => {
  if (!file) {
    console.log("No file selected");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "images");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    console.log("CLOUDINARY RESPONSE:", data);

    if (!res.ok || !data.secure_url) {
      console.error("Upload failed:", data);
      throw new Error(data.error?.message || "Upload failed");
    }

    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (err) {
    console.error("Upload error:", err);
    throw err;
  }
};

export default uploadImage;