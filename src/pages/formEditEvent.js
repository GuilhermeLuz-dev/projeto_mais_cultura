// Função que pegar os dados editados
const getDataForEdit = async (currentImageName) => {
  const tituloValue = document.getElementById("eventNameEdited").value;
  const descricaoValue = document.getElementById("descricaoEdited").value;
  const categoriaValue = document.getElementById("categoriaEdited").value;
  const fileInput = document.getElementById("fileInputEdited");
  const dateValue = document.getElementById("dateEdited").value;
  const enderecoValue = document.getElementById("enderecoEdited").value;
  const url = await changeImage(fileInput.files[0], currentImageName);

  const newsData = {};
  if (tituloValue) newsData.titulo = tituloValue;
  if (descricaoValue) newsData.descricao = descricaoValue;
  if (categoriaValue) newsData.categoria = categoriaValue;
  if (dateValue) newsData.data = dateValue;
  if (enderecoValue) newsData.endereco = enderecoValue;
  if (url) {
    newsData.imagemUrl = url;
    newsData.imageName = fileInput.files[0].name;
  }

  return newsData;
};

// Trocando de imagem
const changeImage = async (file, currentImageName) => {
  if (file) {
    await deleteImage(currentImageName);
    return await getImageUrl(file);
  } else {
    return null;
  }
};
