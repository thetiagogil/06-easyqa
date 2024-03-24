import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Link from "next/link";
import { MdExplore, MdDashboard, MdArchive } from "react-icons/md";

const Navbar = () => {
  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected ? (
        <>
          <ConnectButton />
        </>
      ) : (
        <div className="d-flex align-items-center gap-3">
          <Link href={`/explore`}>
            <button className="btn btn-secondary"><MdExplore /></button>
          </Link>

          <Link href={`/dashboard`}>
          <button className="btn btn-secondary"><MdDashboard /></button>
          </Link>

          <Link href={`/archive`}>
          <button className="btn btn-secondary"><MdArchive /></button>
          </Link>

          <ConnectButton accountStatus="avatar" chainStatus="icon" />
        </div>
      )}
    </>
  );
};

export default Navbar;
