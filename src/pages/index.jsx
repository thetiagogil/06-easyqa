import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { useAccount } from "wagmi";
import supabase from "../utils/supabase";

const Index = () => {
  const { isConnected, address } = useAccount();
  const { status } = useSession();

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

      // If no user found, insert a new user record
      if (!existingUser || existingUser.length === 0) {
        const { data: newUser, error } = await supabase
          .from("users")
          .insert({ wallet_address: address })
          .select();

        if (error) {
          console.log(error);
          return;
        }

        console.log("New user created:", newUser);
      }
    } catch (error) {
      console.error("Error handling authentication:", error.message);
    }
  };

  useEffect(() => {
    if (isConnected) {
      handleAuth();
    }
  }, [status, isConnected]);

  return (
    <div>
      {!isConnected ? (
        <>
          <p>User is not Connected</p>
          <ConnectButton />
        </>
      ) : (
        <>
          <p>User is Connected</p>
          <ConnectButton />
        </>
      )}
    </div>
  );
};

export default Index;
