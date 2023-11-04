import { beginCell, toNano, Address, Cell, fromNano } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import {
  DimCard,
  FlexBoxCol,
  FlexBoxRow,
  DimButton,
  RefTable,
} from "./styled/styled";

function tonViewerTestnetUrl(addr = "") {
  return "https://testnet.tonviewer.com/" + addr;
}

export function Jetton() {
  const { connected } = useTonConnect();
  const { mint, jettonAddr, jettonWalletAddress, balance } = useFaucetJettonContract();

  return (
    <DimCard title="Jetton">
      <FlexBoxCol>
        <b>Faucet to mint JET1 coin</b>
        <FlexBoxRow>
          <table>
            <tr><td><b>User Balance:</b></td><td>{balance ?? ""}</td></tr>
          </table>
        </FlexBoxRow>
        <FlexBoxRow>
          <RefTable>
            <table>
              <tr><td><b>JET1 (Minter):</b></td><td><a href={tonViewerTestnetUrl(jettonAddr)} target="_blank">{jettonAddr}</a></td></tr>
              <tr><td><b>JET1 (User Wallet):</b></td><td><a href={tonViewerTestnetUrl(jettonWalletAddress!)} target="_blank">{jettonWalletAddress}</a></td></tr>
            </table>
          </RefTable>
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
