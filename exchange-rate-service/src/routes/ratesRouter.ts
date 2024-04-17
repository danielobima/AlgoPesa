import { Router } from "express";
import prisma from "../../config/prisma";
import dayjs from "dayjs";
import {getRate} from "../call";

const ratesRouter = Router();

ratesRouter.get("/", async (req, res) => {
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

  //first check database
  const rate = await prisma.rate.findFirst({
    where: {
      crpyto,
    },
  });

  if (rate && dayjs(rate.updatedAt).isAfter(dayjs().subtract(1, "hour"))) {
    res.status(200).send({
      crpyto: rate.crpyto,
      currency: rate.currency,
      amount: rate.rate * parseInt(amount),
    });
    return;
  }

  //Get the rate for 1 algo, then save the rate in the database
  const newAmount = await getRate(currency, 1);

  await prisma.rate.create({
    data: {
      crpyto,
      currency,
      rate: newAmount,
    },
  });

  res.status(200).send({
    crpyto,
    currency,
    amount: newAmount * parseInt(amount),
  });
  return;
});

export default ratesRouter;
