import Navbar from "../components/Navbar";
import { FaArchive } from "react-icons/fa";

const Archive = () => {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end mb-4">
        <Navbar />
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Archive</h1>
      </div>
    </div>
  );
};

export default Archive;
