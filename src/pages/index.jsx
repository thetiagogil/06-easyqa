import { useContext, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import { AuthContext } from "../context/UserContext";
import Connect from "../components/Connect";

const Index = () => {
  const { handleAuth, userId } = useContext(AuthContext);
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      handleAuth();
    }

    if (isConnected && userId) {
      router.push({
        pathname: "/dashboard",
      });
    }
  }, [userId, isConnected]);

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center mt-5">
      <h2 className="text-center mb-4">
        Connect to your wallet to join the website!
      </h2>

      <Connect />
    </div>
  );
};

export default Index;
