// src/components/Home.tsx
import { useWallet } from "@txnlab/use-wallet";
import React, { useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import getRate, { getRateParams } from "../apis/getRates";

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

  const [amountInAlgos, setAmountInAlgos] = useState<string>("");

  const handleGetRate = async () => {
    try {
      const response = await getRate(params);

      setAmountInAlgos(response.amount);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal);
  };

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal);
  };

  return (
    <div className="hero min-h-screen bg-teal-400">
      <div className="hero-content text-center rounded-lg p-6 max-w-md bg-white mx-auto">
        <div className="max-w-md">
          <div>
            <label htmlFor="amount_in_ksh">Amount in Ksh</label>
            <input
              type="text"
              id="amount_in_ksh"
              name="amount_in_ksh"
              title="Enter the amount in Ksh"
              placeholder="Enter amount"
              value={params.amount}
              onChange={(e) => {
                setParams((prev) => ({ ...prev, amount: e.target.value }));
              }}
            />
          </div>
          <button
            type="button"
            id="query_button"
            onClick={() => {
              handleGetRate();
            }}
          >
            Query
          </button>
          <div>
            <label htmlFor="amount_in_algorand">Amount in Algorand</label>
            <input type="text" id="amount_in_algorand" name="amount_in_algorand" disabled value={amountInAlgos} />
          </div>
          {/* <div>
            <label htmlFor="phone_number">Phone Number</label>
            <input type="text" id="phone_number" name="phone_number" title="Enter your phone number" placeholder="123-456-7890" />
          </div> */}
          {/* <button type="submit">Send</button> */}
          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
          {/* <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} /> */}
        </div>
      </div>
    </div>
  );
};

export default RatesPage;
