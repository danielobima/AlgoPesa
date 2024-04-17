// src/components/Home.tsx
import { useWallet } from "@txnlab/use-wallet";
import React, { useEffect, useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import getRate, { getRateParams } from "../apis/getRates";
import convert from "../apis/convert";
import "../styles/convert.css";
import "../styles/styles.css";
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
  const [conversionResponse, setConversionResponse] = useState<any | null>(null);

  const [amountInAlgos, setAmountInAlgos] = useState<string>("");

  const handleGetRate = async () => {
    try {
      const response = await getRate(params);

      setAmountInAlgos(response.amount);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleConvert = async () => {
    try {
      const response = await convert({
        amount_in_ksh: params.amount,
        phone_number,
      });
      setConversionResponse(response);
    } catch (error: any) {
      console.log(error);
      alert(error.message);
    }
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
        <div className="converted-amount">
          {amountInAlgos && <p>{amountInAlgos} ALGO</p>}
          <span>{/* <img src="./assests/icons/two-arrows (3).png" alt="" /> */}</span>
        </div>
        <button
          className="convert-button"
          onClick={() => {
            handleConvert();
          }}
        >
          Convert
        </button>

        {conversionResponse && (
          <>
            <p>{conversionResponse?.message}</p>
            <p>Transaction ID: {conversionResponse?.transactionId}</p>
            <p>ALGO: {conversionResponse?.amount_in_algorand}</p>
          </>
        )}

        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      </section>
    </>
  );
};

export default RatesPage;
