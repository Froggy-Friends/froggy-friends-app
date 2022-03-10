import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_API;

export interface ProofRequest {
  wallet: string;
}

export interface ProofResponse {
  proof: string[];
}

export async function getProof(req: ProofRequest): Promise<ProofResponse> {
  let response = await axios.post<ProofResponse>('/proof', req);
  return response.data;
}