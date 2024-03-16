import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import supabase from "../utils/supabase";
import Connect from "../components/Connect";

const Dashboard = () => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { userId } = router.query;
  const [user, setUser] = useState(null);

  const handleQuestionFormButtonClick = () => {
    router.push({
      pathname: "/question/form",
      query: { userId },
    });
  };

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
  }, [isConnected]);

  return (
    <div>
      <Connect />
      <h1>Dashboard</h1>
      {user ? (
        <div>
          <p>User Wallet Address: {user.wallet_address}</p>
          <button onClick={handleQuestionFormButtonClick}>Question</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;
