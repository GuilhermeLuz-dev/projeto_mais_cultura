// Formatando datas
const formatDate = (date) => {
  const mesesAbreviados = [
    "JAN",
    "FEV",
    "MAR",
    "ABR",
    "MAI",
    "JUN",
    "JUL",
    "AGO",
    "SET",
    "OUT",
    "NOV",
    "DEZ",
  ];
  // Extrair dia e mês
  const day = date.getDate();
  const month = mesesAbreviados[date.getMonth()];
  const year = date.getFullYear();

  // Montar a string no formato desejado
  return { day: day, month: month, year: year };w
};

export { formatDate };
