import axios from "axios";
import baseAxios from "./axios";

export type getRateParams = { crpyto: string; currency: string; amount: string };
export default async function getRate(params: getRateParams) {
  const ratesResponse = await baseAxios.get<{
    amount: number;
  }>("/api/rates", {
    params,
  });

  return ratesResponse.data;
}
