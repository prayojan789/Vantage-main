import api from "../lib/api";

export const getAnalyticsSummary = () => api.get("/analytics/summary");
