import { useState } from "react";
import ConnectWallet from "../components/ConnectWallet";
import "../styles/styles.css";
import "../styles/App.css";

const HomePage = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false);

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
          Connect to wallet
        </button>
      </nav>
      <section className="brand">
        <div className="brand-div">
          <p>Shilling to Algo in a Snap!</p>
          <button
            className="navbar-button"
            onClick={() => {
              setOpenWalletModal(true);
            }}
          >
            Connect to wallet
          </button>
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
