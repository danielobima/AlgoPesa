import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ratesRouter from "./routes/ratesRouter";
import path from "path";
import axios from "axios";
import dayjs from "dayjs";
import { getRate } from "./call.js";

const clientId = 'a4c06d2fd0948a4a';
const clientSecret = 'qFpbf6xQt8wvzaIuvc2Cfg==';
const tokenId = '648b83da-a55f-42eb-9788-5c05917b833d';

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["*"],
  })
);
// a comment
// app.use(cookieParser());

const port = parseInt(process.env.PORT || "3000", 10);

const router = express.Router();

router.use("/rates", ratesRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})
app.post("/pay", async (req, res) => {
  console.log(req.body)
  const { phone_number } = req.body
  const { amount_in_ksh } = req.body
  const mpesaPayment = async () => {
      const amount_in_algorand = await getRate('KES', amount_in_ksh);
      console.log('Amount in Algorand:', amount_in_algorand);
      res.json({ amount_in_algorand });
      const { data } = await axios.post(
          `https://pay.little.africa/api/payments/${tokenId}/pay`,
          {
              amount: Number(amount_in_ksh),
              currency: 'KES',
              description: 'string',
              callbackUrl: 'https://google.com',
              key: dayjs().valueOf().toString(),
              payload: {
                  billingAddress: {
                      firstName: 'string',
                      lastName: 'string',
                      address1: 'string',
                      locality: 'string',
                      administrativeArea: 'string',
                      postalCode: 'string',
                      country: 'string',
                      email: 'test@mail.com',
                      phoneNumber: 'string'
                  }
              }
          },
          {
              auth: {
                  username: clientId,
                  password: clientSecret
              }
          }
      );

      const { reference } = data.data;

      const paymentResponse = await axios.post(
          `https://pay.little.africa/pay/${reference}/process`,
          {
              type: 'MPESA',
              payment: {
                  mobile: phone_number
              }
          },
          {
              params: {
                  longPoll: true
              }
          }
      );

      console.log(paymentResponse.data);
  };

  mpesaPayment()
      .then(() => console.log('Payment successful'))
      .catch(console.error);
});

app.use("/api", router);

(async () => {
  //   await transporter.verify();
  //   console.log(">>>>>> Mail transporter ready");
  //   await sequelize.authenticate();
  //   console.log(">>>>>> DB connected successfully");
  app.listen(port, () => {
    console.log(`Running on port ${port}.`);
  });
})();
