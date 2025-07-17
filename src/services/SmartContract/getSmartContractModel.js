import api from "@/services/api";
export async function getSmartContractModel() {
  try {
    const response = await api.get("/smart-contract-models");
    return response.data;
  } catch (error) {
    // console.error("Error fetching smart contract model:", error);
    throw error;
  }
}
