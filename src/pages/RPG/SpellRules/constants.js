export const YEARS = [1, 2, 3, 4, 5, 6, 7, 8];

export const YEAR_CARD_BG =
   "https://i.pinimg.com/736x/c3/b4/fc/c3b4fcef2eb8b7e9f75c7a329122c2d2.jpg";

export const getYearLabel = (year) => {
   return year === 8 ? "Pós-Hogwarts" : `${year}º Ano`;
};

export const getClosedYearLabel = (year) => {
   return year === 8 ? "PÓS" : `${year} ANO`;
};
