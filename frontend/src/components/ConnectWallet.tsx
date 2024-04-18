import { Provider, useWallet } from "@txnlab/use-wallet";
import Account from "./Account";
import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack } from "@mui/material";

interface ConnectWalletInterface {
  openModal: boolean;
  closeModal: () => void;
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { providers, activeAddress } = useWallet();

  const isKmd = (provider: Provider) => provider.metadata.name.toLowerCase() === "kmd";

  useEffect(() => {
    console.log("Available providers:", providers);
  }, [providers]);

  return (
    <Dialog
      open={openModal}
      onClose={() => {
        closeModal();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{activeAddress ? "Your Wallet" : "Select wallet Provider"}</DialogTitle>
      <DialogContent>
        <Stack py={2} spacing={2}>
          {activeAddress && (
            <>
              <Account />
              <Divider />
            </>
          )}
          {!activeAddress &&
            providers?.map((provider) => (
              <Button
                data-test-id={`${provider.metadata.id}-connect`}
                key={`provider-${provider.metadata.id}`}
                onClick={() => {
                  return provider.connect();
                }}
                variant="contained"
              >
                {!isKmd(provider) && (
                  <img
                    alt={`wallet_icon_${provider.metadata.id}`}
                    src={provider.metadata.icon}
                    style={{ objectFit: "contain", width: "30px", height: "auto" }}
                  />
                )}
                <span>{isKmd(provider) ? "LocalNet Wallet" : provider.metadata.name}</span>
              </Button>
            ))}
        </Stack>
      </DialogContent>

      <DialogActions>
        {activeAddress && (
          <Button
            data-test-id="logout"
            variant="outlined"
            onClick={() => {
              if (providers) {
                const activeProvider = providers.find((p) => p.isActive);
                if (activeProvider) {
                  activeProvider.disconnect();
                } else {
                  // Required for logout/cleanup of inactive providers
                  // For instance, when you login to localnet wallet and switch network
                  // to testnet/mainnet or vice verse.
                  localStorage.removeItem("txnlab-use-wallet");
                  window.location.reload();
                }
              }
            }}
          >
            Logout
          </Button>
        )}
        <Button
          onClick={() => {
            closeModal();
          }}
          variant="contained"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ConnectWallet;
