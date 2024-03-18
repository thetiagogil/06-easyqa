import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Connect = () => {
  const { isConnected } = useAccount();

  return (
    <div>
      {!isConnected ? (
        <>
          <ConnectButton />
        </>
      ) : (
        <>
          <ConnectButton accountStatus="avatar" chainStatus="icon" />
        </>
      )}
    </div>
  );
};

export default Connect;
