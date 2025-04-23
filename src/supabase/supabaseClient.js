import supabase from "./superbaseConfig";

// Função para fazer upload de imagem
const uploadImage = async (file) => {
  const { data, error } = await supabase.storage
    .from("imagens-mais-cultura")
    .upload(`baners/${file.name}`, file, {
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

export { getImageUrl };
