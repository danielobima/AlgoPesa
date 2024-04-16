import { Router } from "express";
import prisma from "../../config/prisma";
import dayjs from "dayjs";

const router = Router();

router.get("/rate", async (req, res) => {
  for (const key in req.query) {
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

  //call apis
  const newAmount = 1;

  await prisma.rate.create({
    data: {
      crpyto,
      currency,
      rate: newAmount,
    },
  });
});
