import { useState } from "react";
import styled from "styled-components";
import { Address, toNano, beginCell } from "ton";
import { useTonConnect } from "../hooks/useTonConnect";
import { useJettonContract } from "../hooks/useJettonContract";
import { DimCard, FlexBoxCol, FlexBoxRow, DimButton, Input } from "./styled/styled";

export function TransferJetton() {
  const { sender, connected } = useTonConnect();
  const [amount, setAmount] = useState("1");
  const [errStr, setErrStr] = useState("");
  const { wallet, recipientAddr, jettonAddr, jettonWalletAddress, balance } = useJettonContract();

  return (
    <DimCard>
      <FlexBoxCol>
        <b>Transfer JET1</b>
        <FlexBoxRow>
          <label>Amount </label>
          <Input
            style={{ marginRight: 8 }}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          ></Input>
        </FlexBoxRow>
        <DimButton
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
                .storeAddress(Address.parse(recipientAddr))    // destination:MsgAddress
                .storeAddress(Address.parse(wallet!))          // response_destination:MsgAddress
                .storeUint(0, 1)               // custom_payload:(Maybe ^Cell)
                .storeCoins(toNano("0.05"))    // forward_ton_amount:(VarUInteger 16)
                .storeUint(0, 1)               // forward_payload:(Either Cell ^Cell)
                .endCell();

              sender.send({
                to: Address.parse(jettonWalletAddress!),
                value: toNano("0.1"),
                body: transferBody
              });
              setErrStr("done")
            } catch (e: any) {
              setErrStr(e.toString())
            }
          }}
        >
          Transfer
        </DimButton>
        <FlexBoxRow>
          recipient: {recipientAddr}<br />
          JET1: {jettonAddr}<br />
          user JET1 Wallet: {jettonWalletAddress}<br />
          {errStr}<br />
        </FlexBoxRow>
      </FlexBoxCol>
    </DimCard>
  );
}
