const axios = require("axios");
const api = axios.create({
  //백엔드 주소

  baseURL: "http://localhost:8081/api",
});

export const dataLap = {
  get: () => {
    return api.get("/data");
  },
  post: (data) => {
    return api.post("/data", data);
  },
};
