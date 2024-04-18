// src/components/Home.tsx
import { useWallet } from "@txnlab/use-wallet";
import React, { useEffect, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import getRate, { getRateParams } from "../apis/getRates";
import convert, { ConversionResponse } from "../apis/convert";
import "../styles/convert.css";
import "../styles/styles.css";
import { Button, CircularProgress, Skeleton, Stack } from "@mui/material";
import ResponseDialog from "../components/ResponseDialog";
// import "../styles/App.css";

interface HomeProps {}

const RatesPage: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false);
  const { activeAddress } = useWallet();
  const [params, setParams] = useState<getRateParams>({
    crpyto: "ALGO",
    currency: "KES",
    amount: "",
  });
  const [phone_number, setPhone_number] = useState<string>("");
  const [conversionResponse, setConversionResponse] = useState<ConversionResponse>();

  const [amountInAlgos, setAmountInAlgos] = useState<string>("");

  const [responseOpen, setResponseOpen] = useState<boolean>(false);

  const [rateLoading, setRateLoading] = useState(false);
  const [conversionLoading, setConversionLoading] = useState(false);

  const handleGetRate = async () => {
    setRateLoading(true);
    console.log("getting the rate");
    try {
      const response = await getRate(params);

      console.log("algos >> ", typeof response.amount, response.amount);
      setAmountInAlgos(response.amount.toFixed(5));
    } catch (error: any) {
      alert(error.message);
    }
    setRateLoading(false);
  };

  const handleConvert = async () => {
    setConversionLoading(true);
    try {
      const response = await convert({
        amount_in_ksh: params.amount,
        phone_number,
      });
      setConversionResponse(response);
      setResponseOpen(true);
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
    setConversionLoading(false);
  };

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (params.amount) {
        handleGetRate();
      } else {
        setAmountInAlgos("");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [params.amount]);

  return (
    <>
      <img className="hero__section-img" src="/assests/pictures/screen2.jpg" alt="" />
      <section className="convert">
        <div className="convert-logic">
          <p>ALGO</p>
          <img src="./assests/svg/dropdown.svg" alt="" />
        </div>
        <div className="convert-input">
          <label htmlFor="">Phone Number</label>
          <input
            aria-label="phone"
            className="gradient-input-text"
            type="text"
            value={phone_number}
            onChange={(e) => {
              setPhone_number(e.target.value);
            }}
          />
        </div>
        <div className="convert-input">
          <label htmlFor="">Amount (KES)</label>
          <input
            aria-label="amount"
            className="gradient-input-text"
            type="number"
            value={params.amount}
            onChange={(e) => {
              setParams((prev) => ({
                ...prev,
                amount: e.target.value,
              }));
            }}
          />
        </div>
        {rateLoading ? (
          <Skeleton variant="rounded" width={240} height={40} />
        ) : (
          <div className="converted-amount">
            {amountInAlgos && <p>~ {amountInAlgos} ALGO</p>}
            <span>{/* <img src="./assests/icons/two-arrows (3).png" alt="" /> */}</span>
          </div>
        )}
        <Button
          onClick={() => {
            handleConvert();
          }}
          startIcon={conversionLoading ? <CircularProgress size={16} /> : undefined}
          sx={{
            background: "var(--Gradient-06, linear-gradient(91deg, #8ad4ec 0%, #ef96ff 21.74%, #ff56a9 54.03%, #ffaa6c 85.28%))",
            color: "white",
            borderRadius: "1000px",
            width: "100%",
            py: 2,
            boxShadow: "0 8px 16px 2px  #ff56a9",

            "&:hover": {
              boxShadow: "0 0px 32px 10px #ef96ff",
            },
          }}
        >
          Convert
        </Button>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              toggleWalletModal();
            }}
          >
            View Wallet
          </Button>

          <a href="/">
            <Button variant="outlined">Home</Button>
          </a>
        </Stack>

        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        <ResponseDialog open={responseOpen} setOpen={setResponseOpen} response={conversionResponse} />
      </section>
    </>
  );
};

export default RatesPage;
