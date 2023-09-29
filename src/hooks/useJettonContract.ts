import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import Jetton from "../contracts/jetton";
import { Address, OpenedContract } from "ton-core";
import FaucetJettonWallet from "../contracts/faucetJettonWallet";
import { useQuery } from "@tanstack/react-query";

const RecipientAddr: string = "kQCBo8IEWCpNfGmmnaZOw12iv0Eei6RpXpjKMhCm91nL8-9-" //???
const JettonAddr: string = "EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y" //???

export function useJettonContract() {
  const { wallet, sender } = useTonConnect();
  const { client } = useTonClient();

  const jettonContract = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const contract = new Jetton(
      Address.parse(JettonAddr)
    );
    return client.open(contract) as OpenedContract<Jetton>;
  }, [client, wallet]);

  const jwContract = useAsyncInitialize(async () => {
    if (!jettonContract || !client) return;
    const jettonWalletAddress = await jettonContract!.getWalletAddress(
      Address.parse(wallet!)
    );
    return client!.open(
      new FaucetJettonWallet(Address.parse(jettonWalletAddress))
    ) as OpenedContract<FaucetJettonWallet>;
  }, [jettonContract, client]);

  const { data, isFetching } = useQuery(
    ["jetton"],
    async () => {
      if (!jwContract) return null;

      return (await jwContract.getBalance()).toString();
    },
    { refetchInterval: 3000 }
  );

  return {
    wallet,
    recipientAddr: RecipientAddr,
    jettonAddr: JettonAddr,
    jettonWalletAddress: jwContract?.address.toString(),
    balance: isFetching ? null : data,
  };
}
