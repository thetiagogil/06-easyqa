import { createContext, useState } from "react";
import { useAccount } from "wagmi";
import supabase from "../utils/supabase";

export const AuthContext = createContext();

const UserContextProvider = ({ children }) => {
  const { address } = useAccount();
  const [userId, setUserId] = useState(null);

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
      } else {
        id = existingUser[0].id;
      }

      setUserId(id);
    } catch (error) {
      console.error("Error handling authentication:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ handleAuth, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserContextProvider;
