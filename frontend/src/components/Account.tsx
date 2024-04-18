import { useWallet } from "@txnlab/use-wallet";
import { useMemo } from "react";
import { ellipseAddress } from "../utils/ellipseAddress";
import { getAlgodConfigFromViteEnvironment } from "../utils/network/getAlgoClientConfigs";
import { Typography } from "@mui/material";

const Account = () => {
  const { activeAddress } = useWallet();
  const algoConfig = getAlgodConfigFromViteEnvironment();

  const dappFlowNetworkName = useMemo(() => {
    return algoConfig.network === "" ? "sandbox" : algoConfig.network.toLocaleLowerCase();
  }, [algoConfig.network]);

  return (
    <div>
      <Typography
        component={"a"}
        className="text-xl"
        target="_blank"
        href={`https://app.dappflow.org/setnetwork?name=${dappFlowNetworkName}&redirect=explorer/account/${activeAddress}/`}
        color="primary"
      >
        Address: {ellipseAddress(activeAddress)}
      </Typography>
      <div className="text-xl">Network: {algoConfig.network === "" ? "localnet" : algoConfig.network}</div>
    </div>
  );
};

export default Account;
