import styles from "../styles/index.module.css";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import supabase from "../utils/supabase";
import Connect from "../components/Connect";

const Index = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [userId, setUserId] = useState(null); // State variable to hold userId

  const handleAuth = async () => {
    try {
      // Query the users table to check if the user exists
      const { data: existingUser, error } = await supabase
        .from("users")
        .select()
        .eq("wallet_address", address);

      if (error) {
        console.log(error);
        return;
      }

      // If no user found, insert a new user
      let id;
      if (!existingUser || existingUser.length === 0) {
        const { data: newUser, error } = await supabase
          .from("users")
          .insert({ wallet_address: address })
          .select();

        if (error) {
          console.log(error);
          return;
        }

        id = newUser.id;
        console.log("New user created:", newUser);
      } else {
        id = existingUser[0].id;
      }

      setUserId(id); // Set userId state
    } catch (error) {
      console.error("Error handling authentication:", error.message);
    }
  };

  useEffect(() => {
    if (isConnected) {
      handleAuth();
    }
  }, [isConnected]);

  useEffect(() => {
    if (userId) {
      router.push({
        pathname: "/dashboard",
        query: { userId },
      });
    }
  }, [userId]);

  return (
    <div className={styles.main}>
      <h2>Connect to your wallet to join the website!</h2>
      <Connect />
    </div>
  );
};

export default Index;
