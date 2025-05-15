import supabase from "./superbaseConfig.js";

// Função para fazer upload de imagem
const uploadImage = async (file) => {
  const { data, error } = await supabase.storage
    .from("imagens-mais-cultura")
    .upload(`banners/${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }
  return data.path;
};

// Função para obter a URL pública da imagem
const getImageUrl = async (file) => {
  const path = await uploadImage(file);
  const { data, error } = await supabase.storage
    .from("imagens-mais-cultura")
    .getPublicUrl(path);
  if (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
  return data.publicUrl;
};

const deleteImage = async (file) => {
  const filePath = `banners/${file}`;
  console.log(filePath);
  const { data, error } = await supabase.storage
    .from("imagens-mais-cultura")
    .remove([filePath]);
  if (error) {
    console.log(error);
  }
  return true;
};

export { getImageUrl, deleteImage };
