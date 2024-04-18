import { useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import "../styles/styles.css";
import "../styles/App.css";
import { Stack } from "@mui/material";
import { useWallet } from "@txnlab/use-wallet";

const HomePage = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);

  const { activeAddress } = useWallet();

  return (
    <section className="hero__section">
      <img className="hero__section-img" src="/assests/pictures/screen2.jpg" alt="" />
      <nav className="navbar">
        <p className="logo">AlgoPesa</p>
        <ul className="navbar__list">
          <li>
            <a href={"/convert"}>Buy ALGO</a>
          </li>
          {/* <li>
            <a href="">Market</a>
          </li> */}
        </ul>
        <button
          className="navbar-button"
          onClick={() => {
            setOpenWalletModal(true);
          }}
        >
          {activeAddress ? "View" : "Connect"} wallet
        </button>
      </nav>
      <section className="brand">
        <div className="brand-div">
          <p>Shilling to Algo in a Snap!</p>
          <Stack direction={"row"} spacing={2}>
            <button
              className="navbar-button"
              onClick={() => {
                setOpenWalletModal(true);
              }}
            >
              {activeAddress ? "View" : "Connect"} wallet
            </button>
            <a href="/convert">
              <button className="navbar-button">Buy Algo</button>
            </a>
          </Stack>
        </div>
      </section>
      <ConnectWallet
        openModal={openWalletModal}
        closeModal={() => {
          setOpenWalletModal(false);
        }}
      />
    </section>
  );
};

export default HomePage;
