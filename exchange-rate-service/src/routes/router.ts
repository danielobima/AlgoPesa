import { Router } from "express";
import dayjs from "dayjs";
import { getRate } from "../call";
import axios from "axios";

import * as trxClient from "../client";
import algosdk from "algosdk";

const algodServer = "https://testnet-api.algonode.cloud";

const algodClient = new algosdk.Algodv2("", algodServer, "");
// const indexer = new algosdk.Indexer("", "https://testnet-idx.algonode.cloud", "");

const clientId = "a4c06d2fd0948a4a";
const clientSecret = "qFpbf6xQt8wvzaIuvc2Cfg==";
const tokenId = "648b83da-a55f-42eb-9788-5c05917b833d";

const router = Router();

router.get("/rates", async (req, res) => {
  try {
    console.log("getting rates");
    const params = ["crpyto", "currency", "amount"];
    for (const key of params) {
      if (typeof req.query[key] !== "string") {
        res.status(400).send({
          message: "Invalid Request",
        });
        return;
      }
    }

    const {
      crpyto = "ALGO",
      currency,
      amount,
    } = req.query as {
      crpyto: string;
      currency: string;
      amount: string;
    };

    //Get the rate for 1 algo, then save the rate in the database
    const newAmount = await getRate(currency, 1);

    res.status(200).send({
      crpyto,
      currency,
      amount: newAmount * parseInt(amount),
    });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/pay", async (req, res) => {
  try {
    console.log(req.body);
    const { phone_number } = req.body;
    const { amount_in_ksh, addr } = req.body;

    const amount_in_algorand = await getRate("KES", amount_in_ksh);

    console.log("Amount in Algorand:", amount_in_algorand);
    const { data } = await axios.post(
      `https://pay.little.africa/api/payments/${tokenId}/pay`,
      {
        amount: Number(amount_in_ksh),
        currency: "KES",
        description: "string",
        callbackUrl: "https://google.com",
        key: dayjs().valueOf().toString(),
        payload: {
          billingAddress: {
            firstName: "string",
            lastName: "string",
            address1: "string",
            locality: "string",
            administrativeArea: "string",
            postalCode: "string",
            country: "string",
            email: "test@mail.com",
            phoneNumber: "string",
          },
        },
      },
      {
        auth: {
          username: clientId,
          password: clientSecret,
        },
      }
    );

    const { reference } = data.data;

    const paymentResponse = await axios.post(
      `https://pay.little.africa/pay/${reference}/process`,
      {
        type: "MPESA",
        payment: {
          mobile: phone_number,
        },
      },
      {
        params: {
          longPoll: true,
        },
      }
    );

    if (paymentResponse.data?.data?.status !== "COMPLETED") {
      res.status(400).send({
        message: "Payment failed",
      });
      return;
    }

    console.log(JSON.stringify(paymentResponse.data, null, 2));
    console.log("Amount in KES:", paymentResponse.data.data.meta.amount);
    console.log("Mobile Number:", paymentResponse.data.data.meta.mpesaResponse.MobileNumber);
    console.log("Transaction ID:", paymentResponse.data.data.meta.mpesaResponse.TrxID);

    const transactionId = paymentResponse.data.data.meta.mpesaResponse.TrxID;

    const client = new trxClient.TransferClient(
      {
        id: 643930681,
        resolveBy: "id",
      },
      algodClient
    );

    const transactionResponse = await client.transaction(
      {
        addr,
        amount: parseInt((amount_in_algorand * 1000000).toFixed(0)),
      },
      {
        sender: algosdk.mnemonicToSecretKey(process.env.MNEMONIC ?? ""),
      }
    );

    res.status(200).send({
      message: "Payment successful",
      amount_in_ksh,
      transactionId,
      amount_in_algorand,
      transactionResponse: transactionResponse.return,
    });
  } catch (error: any) {
    console.log(error.response?.data?.message ?? error.message);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

export default router;
