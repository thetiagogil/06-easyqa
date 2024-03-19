import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import AuthContextProvider from "../context/UserContext";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  zora,
} from "wagmi/chains";

const config = getDefaultConfig({
  appName: "EASYQA",
  projectId: "c09b15fda71450a020133d05cba890d2",
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

const client = new QueryClient();

const App = ({ Component, pageProps }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <SessionProvider session={pageProps.session}>
          <RainbowKitProvider>
            <AuthContextProvider>
              <Component {...pageProps} />
            </AuthContextProvider>
          </RainbowKitProvider>
        </SessionProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
