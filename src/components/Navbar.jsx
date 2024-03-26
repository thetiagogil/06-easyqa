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
        <ul className="nav d-flex gap-2">
          <li className="nav-item">
            <Link href="/explore" passHref>
              <button className="btn btn-secondary"><MdExplore /></button>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/dashboard" passHref>
              <button className="btn btn-secondary"><MdDashboard /></button>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/archive" passHref>
              <button className="btn btn-secondary"><MdArchive /></button>
            </Link>
          </li>
          <li className="nav-item">
            <ConnectButton accountStatus="avatar" chainStatus="icon" />
          </li>
        </ul>
      )}
    </>
  );
};

export default Navbar;
