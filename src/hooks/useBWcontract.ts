import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import Jetton from "../contracts/jetton";
import { Address, OpenedContract, fromNano } from "ton-core";
import FaucetJettonWallet from "../contracts/faucetJettonWallet";
import BWsettle from "../contracts/bwSettle";
import BWuserJettonAccount from "../contracts/bwUserJettonAccount";
import { useQueries } from "@tanstack/react-query";

const BwAddr: string = "EQCKCj7xFLn4LVx_ugt-sznvPOr6pyDe_LKebNR1Kj8C7WwT"
const JettonAddr: string = "EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y" //???

export function useBwContract() {
  const { wallet, sender } = useTonConnect();
  const { client } = useTonClient();

  const contracts = useAsyncInitialize(async () => {
    if (!client || !wallet) return;
    const contract = new Jetton(Address.parse(JettonAddr));
    const jettonMinterContract = client.open(contract) as OpenedContract<Jetton>;

    if (!jettonMinterContract) return;
    const userJettonWalletAddress = await jettonMinterContract!.getWalletAddress(Address.parse(wallet!));
    const userJettonWalletContract = client!.open(
      new FaucetJettonWallet(Address.parse(userJettonWalletAddress))
    ) as OpenedContract<FaucetJettonWallet>;

    const bwJettonWalletAddress = await jettonMinterContract!.getWalletAddress(Address.parse(BwAddr!));
    const bwJettonWalletContract = client!.open(
      new FaucetJettonWallet(Address.parse(bwJettonWalletAddress))
    ) as OpenedContract<FaucetJettonWallet>;

    const contract2 = new BWsettle(Address.parse(BwAddr));
    const bwSettleContract = client.open(contract2) as OpenedContract<BWsettle>;

    if (!bwSettleContract) return;
    const bwUserJettonAccountAddress = await bwSettleContract!.getUserJettonAccountAddress(
      Address.parse(wallet!), bwJettonWalletContract?.address!
    );
    const bwUserJettonAccountContract = client!.open(
      new BWuserJettonAccount(bwUserJettonAccountAddress)) as OpenedContract<BWuserJettonAccount>;

    return [userJettonWalletContract, bwJettonWalletContract, bwUserJettonAccountContract]
  }, [client, wallet]);

  const userJettonWalletContract = contracts?.at(0) as OpenedContract<FaucetJettonWallet> | undefined
  const bwJettonWalletContract = contracts?.at(1) as OpenedContract<FaucetJettonWallet> | undefined
  const bwUserJettonAccountContract = contracts?.at(2) as OpenedContract<BWuserJettonAccount> | undefined

  const [userJettonQuery, bwJettonQuery, bwUserJettonQuery] = useQueries({
    queries: [
      {
        queryKey: ['userJetton'],
        queryFn: async () => {
          return userJettonWalletContract ? (await userJettonWalletContract.getBalance()).toString() : "-"
        },
        refetchInterval: 3000
      },
      {
        queryKey: ['bwJetton'],
        queryFn: async () => {
          return bwJettonWalletContract ? (await bwJettonWalletContract.getBalance()).toString() : "-"
        },
        refetchInterval: 3000
      },
      {
        queryKey: ['bwUserJetton'],
        queryFn: async () => {
          return bwUserJettonAccountContract ? fromNano(await bwUserJettonAccountContract.getJettonBalance()) : "-"
        },
        refetchInterval: 3000
      },
    ],
  });


  return {
    wallet,
    bwAddr: BwAddr,
    jettonAddr: JettonAddr,
    userJettonWalletAddress: userJettonWalletContract?.address.toString(),
    bwJettonWalletAddress: bwJettonWalletContract?.address.toString(),
    bwUserJettonAccountAddress: bwUserJettonAccountContract?.address.toString(),
    userJettonBalance: userJettonQuery.isLoading ? null : userJettonQuery.data,
    bwJettonBalance: bwJettonQuery.isLoading ? null : bwJettonQuery.data,
    bwUserJettonBalance: bwUserJettonQuery.isLoading ? null : bwUserJettonQuery.data,
  };
}
