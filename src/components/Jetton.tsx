import { beginCell, toNano, Address, Cell, fromNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import {
  DimCard,
  FlexBoxCol,
  FlexBoxRow,
  DimButton,
  Ellipsis,
} from "./styled/styled";

export function Jetton() {
  const { connected } = useTonConnect();
  const { mint, jettonAddr, jettonWalletAddress, balance } = useFaucetJettonContract();

  return (
    <DimCard title="Jetton">
      <FlexBoxCol>
        <b>Faucet to mint JET1 coin</b>
        <FlexBoxRow>
          JET1: {jettonAddr}<br />
          user JET1 Wallet: {jettonWalletAddress}
        </FlexBoxRow>
        <FlexBoxRow>
          Balance
          <div>{balance ?? "Loading..."}</div>
        </FlexBoxRow>
        <DimButton
          disabled={!connected}
          onClick={async () => {
            mint();
          }}
        >
          Mint JET1 from faucet
        </DimButton>
      </FlexBoxCol>
    </DimCard >
  );
}
