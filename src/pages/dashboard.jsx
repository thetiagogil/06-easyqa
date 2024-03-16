import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../utils/supabase";
import Connect from "../components/Connect";

const Dashboard = () => {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: userData, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching user:", error.message);
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return (
    <div>
      <Connect />
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>User Wallet Address: {user.wallet_address}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
