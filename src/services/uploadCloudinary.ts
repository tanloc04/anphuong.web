export const uploadToCloudinary = async (file: File) => {
  const cloudName =  "dfniy6iy3";
  const uploadPreset = "anphuong-pictures";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary Error:", errorData);
      throw new Error("Lỗi khi upload ảnh!");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error("Upload failed:", error);
    return null;
  }
};