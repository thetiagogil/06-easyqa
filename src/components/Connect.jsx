import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect } from "react";

const Connect = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected]);

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
