import api from "../lib/api";

export const analyzeText = (text) => api.post("/sentiment", { text });
