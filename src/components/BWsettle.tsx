import { useState } from "react";
import styled from "styled-components";
import { Address, toNano, beginCell } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useBwContract } from "../hooks/useBWcontract";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input, RefTable } from "./styled/styled";
import BWlogoDev from "../svg/LogoDark_DEV.svg"

function tonViewerTestnetUrl(addr = "") {
  return "https://testnet.tonviewer.com/" + addr;
}

export function BWsettle() {
  const { wallet, sender, connected } = useTonConnect();
  const [amount, setAmount] = useState("1");
  const [errStr, setErrStr] = useState("");
  const { userJettonWallet, bwSettleContract, bwAddr, jettonAddr,
    userJettonWalletAddress, bwJettonWalletAddress, bwUserJettonAccountAddress,
    userJettonBalance, bwJettonBalance, bwUserJettonBalance } = useBwContract();

  return (
    <Card>
      <FlexBoxCol>
        <img src={BWlogoDev} alt="BusyWhale" width="160" height="48" />
        <h3>Custody (Deposit/Withdrawal)</h3>
        <FlexBoxRow>
          <table>
            <tr><td><b>Coin:</b></td><td><b>JET1</b></td></tr>
            <tr><td><b>User Balance:</b></td><td>{userJettonBalance ?? "..."}</td></tr>
            <tr><td><b>BusyWhale Balance:</b></td><td>{bwJettonBalance ?? "..."}</td></tr>
            <tr><td><b>User deposited:</b></td><td>{bwUserJettonBalance ?? "..."}</td></tr>
          </table>
        </FlexBoxRow>
        <FlexBoxRow>
          <label>Amount</label>
          <Input
            style={{ marginRight: 4 }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></Input>
        </FlexBoxRow>
        <Button
          disabled={!connected}
          style={{ marginTop: 4 }}
          onClick={async () => {
            userJettonWallet?.sendBWdeposit(sender, toNano(amount), Address.parse(bwAddr), Address.parse(wallet!))
          }}
        >
          Deposit
        </Button>
        <Button
          disabled={!connected}
          style={{ marginTop: 4 }}
          onClick={async () => {
            bwSettleContract?.sendUserWithdrawal(sender, toNano(amount), Address.parse(bwJettonWalletAddress!), Address.parse(wallet!))
          }}
        >
          Withdrawal
        </Button>
        <FlexBoxRow>
          <RefTable>
            <table>
              <tr><td></td><td>View On-chain data in <a href={tonViewerTestnetUrl()}>{tonViewerTestnetUrl()}</a></td></tr>
              <tr><td><b>User:</b></td><td><a href={tonViewerTestnetUrl(wallet ? wallet.toString() : "")} target="_blank">{wallet ? wallet.toString() : ""}</a></td></tr>
              <tr><td><b>BusyWhale:</b></td><td><a href={tonViewerTestnetUrl(bwAddr)} target="_blank">{bwAddr}</a></td></tr>
              <tr><td><b>JET1 (Minter):</b></td><td><a href={tonViewerTestnetUrl(jettonAddr)} target="_blank">{jettonAddr}</a></td></tr>
              <tr><td><b>JET1 (User Wallet):</b></td><td><a href={tonViewerTestnetUrl(userJettonWalletAddress!)} target="_blank">{userJettonWalletAddress}</a></td></tr>
              <tr><td><b>JET1 (BW Wallet):</b></td><td><a href={tonViewerTestnetUrl(bwJettonWalletAddress!)} target="_blank">{bwJettonWalletAddress}</a></td></tr>
              <tr><td><b>JET1 (BW User Acc):</b></td><td><a href={tonViewerTestnetUrl(bwUserJettonAccountAddress!)} target="_blank">{bwUserJettonAccountAddress}</a></td></tr>
              <tr><td><b></b></td><td>{errStr}</td></tr>
            </table>
          </RefTable>
        </FlexBoxRow>
      </FlexBoxCol>
    </Card >
  );
}
