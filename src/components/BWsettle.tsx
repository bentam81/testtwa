import { useState } from "react";
import styled from "styled-components";
import { Address, toNano, beginCell } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useBwContract } from "../hooks/useBWcontract";
import { Card, FlexBoxCol, FlexBoxRow, Button, Input, RefTable } from "./styled/styled";

function tonViewerTestnetUrl(addr: string) {
  return "https://testnet.tonviewer.com/" + addr;
}

export function BWsettle() {
  const { sender, connected } = useTonConnect();
  const [amount, setAmount] = useState("1");
  const [errStr, setErrStr] = useState("");
  const { wallet, bwAddr, jettonAddr,
    userJettonWalletAddress, bwJettonWalletAddress, bwUserJettonAccountAddress,
    userJettonBalance, bwJettonBalance, bwUserJettonBalance } = useBwContract();

  return (
    <Card>
      <FlexBoxCol>
        <h3>TEST BW Settle</h3>
        <FlexBoxRow>
          <table>
            <tr><td><b>Coin:</b></td><td><b>JET1</b></td></tr>
            <tr><td><b>User Balance:</b></td><td>{userJettonBalance ?? "..."}</td></tr>
            <tr><td><b>BusyWhale Balance:</b></td><td>{bwJettonBalance ?? "..."}</td></tr>
            <tr><td><b>User deposited:</b></td><td>{bwUserJettonBalance ?? "..."}</td></tr>
          </table>
        </FlexBoxRow>
        <FlexBoxRow>
          <label>Deposit Amount </label>
          <Input
            style={{ marginRight: 8 }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></Input>
        </FlexBoxRow>
        <Button
          disabled={!connected}
          style={{ marginTop: 18 }}
          onClick={async () => {
            try {
              setErrStr("")
              const JettonDecimal = 1e9 //???
              const amountInt = BigInt(Number(amount) * JettonDecimal)

              const transferBody = beginCell()
                .storeUint(0xf8a7ea5, 32)      // jetton transfer op code
                .storeUint(0, 64)              // query_id:uint64
                .storeCoins(amountInt)         // amount:(VarUInteger 16) -  Jetton amount for transfer (decimals = 6 - jUSDT, 9 - default)
                .storeAddress(Address.parse(bwAddr))    // destination:MsgAddress
                .storeAddress(Address.parse(wallet!))          // response_destination:MsgAddress
                .storeUint(0, 1)               // custom_payload:(Maybe ^Cell)
                .storeCoins(toNano("0.05"))    // forward_ton_amount:(VarUInteger 16)
                .storeUint(0, 1)               // forward_payload:(Either Cell ^Cell)
                .endCell();

              sender.send({
                to: Address.parse(userJettonWalletAddress!),
                value: toNano("0.1"),
                body: transferBody
              });
              setErrStr("done")
            } catch (e: any) {
              setErrStr(e.toString())
            }
          }}
        >
          Deposit
        </Button>
        <FlexBoxRow>
          <RefTable>
            <table>
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
