import api from "../lib/api";

export const getSources = () => api.get("/sources");
