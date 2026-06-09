import axios from "axios";

const api = axios.create({
  baseURL: "https://api.potterdb.com/v1",
});

export const getSpells = async () => {
   let currentPage = 1;
   let totalPages = 1;
   let spells = [];

   while (currentPage <= totalPages) {
      const response = await api.get(
         `/spells?page[number]=${currentPage}&page[size]=100`
      );

      spells = [...spells, ...response.data.data];

      totalPages = response.data.meta.pagination.last;
      currentPage++;
   }

   return spells;
};

export const getPotions = async () => {
   let currentPage = 1;
   let totalPages = 1;
   let potions = [];

   while (currentPage <= totalPages) {
      const response = await api.get(
         `/potions?page[number]=${currentPage}&page[size]=100`
      );

      potions = [...potions, ...response.data.data];

      totalPages = response.data.meta.pagination.last;
      currentPage++;
   }

   return potions;
};

export const getCharacters = async () => {
   let currentPage = 1;
   let totalPages = 1;
   let characters = [];

   while (currentPage <= totalPages) {
      const response = await api.get(
         `/characters?page[number]=${currentPage}&page[size]=100`
      );

      characters = [...characters, ...response.data.data];

      totalPages = response.data.meta.pagination.last;
      currentPage++;
   }

   return characters;
};

export const getBooks = async () => {
   let currentPage = 1;
   let totalPages = 1;
   let books = [];

   while (currentPage <= totalPages) {
      const response = await api.get(
         `/books?page[number]=${currentPage}&page[size]=100`
      );

      books = [...books, ...response.data.data];

      totalPages = response.data.meta.pagination.last;
      currentPage++;
   }

   return books;
};

export const getMovies = async () => {
   let currentPage = 1;
   let totalPages = 1;
   let movies = [];

   while (currentPage <= totalPages) {
      const response = await api.get(
         `/movies?page[number]=${currentPage}&page[size]=100`
      );

      movies = [...movies, ...response.data.data];

      totalPages = response.data.meta.pagination.last;
      currentPage++;
   }

   return movies;
};