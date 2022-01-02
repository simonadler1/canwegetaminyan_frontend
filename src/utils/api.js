import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API_URL + "/api" + "/v1",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  CreateMinyan(data) {
    return apiClient.post("/minyan", data);
  },
  GetMinyan(id) {
    return apiClient.get("/minyan/" + id);
  },
  UpdateMinyan(id, data) {
    return apiClient.put("/minyan/" + id, data);
  },
};
