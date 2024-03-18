import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";

const useIsConnected = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);
};

export default useIsConnected;
