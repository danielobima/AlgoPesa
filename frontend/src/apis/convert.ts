import axios from "axios";
import baseAxios from "./axios";

export type convertParams = { amount_in_ksh: string; phone_number: string };
export type ConversionResponse = {
  message: string;
  amount_in_ksh?: string;
  transactionId?: string;
  amount_in_algorand?: string;
};
export default async function convert(params: convertParams) {
  const ratesResponse = await baseAxios.post<ConversionResponse>("/api/pay", params);

  return ratesResponse.data;
}
