import axios from "axios";

const request = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const api = {
  jsonplaceholder: {
    findAll: () => request.get("/products"),
    findOne: (id) => request.get(`/products/${id}`),
  },
};
