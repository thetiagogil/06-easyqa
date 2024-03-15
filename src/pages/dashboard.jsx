import { useEffect, useState } from "react";
import supabase from "../utils/supabase";

const Dashboard = ({ user }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error.message);
        return;
      }

      setUserData(data);
    }

    fetchUserData();
  }, [user.id]);

  return (
    <div>
      <h1>Welcome, {userData?.username}</h1>
      {/* Display user's questions and answers */}
    </div>
  );
};

export default Dashboard;
