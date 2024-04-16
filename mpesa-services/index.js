const express = require('express');
const path = require('path');
let PORT = 3010 || process.env.PORT

const app = express();

app.use(express.json())
const { default: axios } = require('axios');
const dayjs = require('dayjs');

const clientId = 'a4c06d2fd0948a4a';
const clientSecret = 'qFpbf6xQt8wvzaIuvc2Cfg==';
const tokenId = '648b83da-a55f-42eb-9788-5c05917b833d';

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})

app.post("/pay", (req, res) => {
    console.log(req.body)
    const { phone_number } = req.body
    const { amount_in_ksh } = req.body
    const mpesaPayment = async () => {
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
})
app.listen(PORT, () => {
    console.log("Listening on http://localhost:3010/")
})
