import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

const Navbar = () => {
  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected ? (
        <>
          <ConnectButton />
        </>
      ) : (
        <div className="d-flex align-items-center gap-4">
          <Link href={`/feed`}>
            <span className="btn btn-secondary">Feed</span>
          </Link>

          <Link href={`/dashboard`}>
            <span className="btn btn-secondary">Dashboard</span>
          </Link>

          <ConnectButton accountStatus="avatar" chainStatus="icon" />
        </div>
      )}
    </>
  );
};

export default Navbar;
