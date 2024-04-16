import axios from 'axios';

async function getRate(currency: string, amount: number): Promise<number> {
    try {
        // getting price of Algorand in dollars
        const algorandResponse = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: 'algorand',
                x_cg_demo_api_key: 'CG-bKiPUAAPSr4B9eAnSXWYD4St'
            }
        });

        const algorandPriceUSD = algorandResponse.data[0].current_price;
        // console.log(`Algorand Price in USD: ${algorandPriceUSD}, Type: ${typeof algorandPriceUSD}`);

        //getting conversion rate of USD to KES
        const conversionResponse = await axios.get('https://api.currencyapi.com/v3/latest', {
            params: {
                apikey: 'cur_live_5hfhJpcEMuBcb9Vuh5ydzzAFjFGpeyR1fSLas8I6',
                currencies: 'KES'
            }
        });
        // console.log(conversionResponse.data);

        const usdToKesRate = conversionResponse.data.data.KES.value;
        // console.log(`USD to KES Rate: ${usdToKesRate}, Type: ${typeof usdToKesRate}`);
        // conversion
        const rate = amount * algorandPriceUSD * usdToKesRate;

        return rate;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}


getRate('KES', 60)

   .then(price => console.log(`60 Algorand is equivalent to ${price} KES`))
   .catch(error => console.error("An error occurred during conversion"));