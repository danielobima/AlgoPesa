import axios from "axios";
import prisma from "../config/prisma";
import dayjs from "dayjs";

async function getRate(currency: string, amount: number): Promise<number> {
  try {
    //first check database
    const dbRate = await prisma.rate.findFirst({
      where: {
        crpyto: "ALGO",
      },
    });

    if (dbRate && dayjs(dbRate.updatedAt).isAfter(dayjs().subtract(1, "hour"))) {
      return dbRate.rate;
    }

    // getting price of Algorand in dollars
    const algorandResponse = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        ids: "algorand",
        x_cg_demo_api_key: "CG-bKiPUAAPSr4B9eAnSXWYD4St",
      },
    });

    const algorandPriceUSD = algorandResponse.data[0].current_price;

    //getting conversion rate of USD to KES
    const conversionResponse = await axios.get("https://api.currencyapi.com/v3/latest", {
      params: {
        apikey: "cur_live_5hfhJpcEMuBcb9Vuh5ydzzAFjFGpeyR1fSLas8I6",
        currencies: "KES",
      },
    });

    const usdToKesRate = conversionResponse.data.data.KES.value;

    // conversion
    const rate = 1 / (algorandPriceUSD * usdToKesRate);

    await prisma.rate.create({
      data: {
        crpyto: "ALGO",
        currency,
        rate,
      },
    });

    return rate;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// getRate('KES', 1)
//     .then(response => console.log(response))
//     .catch(error => console.error(error));

export { getRate };
