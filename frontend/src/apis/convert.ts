import axios from "axios";
import baseAxios from "./axios";

export type convertParams = { amount_in_ksh: string; phone_number: string };
export default async function convert(params: convertParams) {
  const ratesResponse = await baseAxios.post<{
    message: string;
    amount_in_ksh?: string;
    transactionId?: string;
    amount_in_algorand?: string;
  }>("/api/pay", params);

  return ratesResponse.data;
}
