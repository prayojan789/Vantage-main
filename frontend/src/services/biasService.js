import api from "../lib/api";

export const getBiasReport = (params = {}) => api.get("/bias", { params });
