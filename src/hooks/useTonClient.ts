import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useState } from "react";
import { TonClient } from "ton";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/protocol";

export function useTonClient() {
  const { network } = useTonConnect();

  return {
    client: useAsyncInitialize(async () => {
      if (!network) return;

      // return new TonClient({
      //   endpoint: await getHttpEndpoint({
      //     network: network === CHAIN.MAINNET ? "mainnet" : "testnet",
      //   }),
      // });

      const endpoint = network === CHAIN.MAINNET ? "https://toncenter.com/api/v2/jsonRPC" : "https://testnet.toncenter.com/api/v2/jsonRPC"
      const apiKey = network === CHAIN.MAINNET ? "65b36c975f91d756e221ec46e2983d1139f1037c946f288ee31e538620f2e581" : "4d3caa4fa0d225510539dd2a1e4d69cf72788247d1a4890c8d0eae62e413f15b"
      return new TonClient({ endpoint });
      // return new TonClient({ endpoint, apiKey });
    }, [network]),
  };
}
