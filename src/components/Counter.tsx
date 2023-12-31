import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { useState } from "react";

import {
  DimCard,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  DimButton,
  Input
} from "./styled/styled";

import { Telegram } from "@twa-dev/types"
declare global {
  interface Window {
    Telegram: Telegram;
  }
}

function getTgUsername() {
  let ret = ""
  const ds = window.Telegram.WebApp.initData.split("&")
  for (let i = 0; i < ds.length; i++) {
    if (ds[i].startsWith("user=")) {
      try {
        let userJson = decodeURIComponent(ds[i].substring(5))
        let j = JSON.parse(userJson);
        ret = j["username"]
      } catch (e) {
        ret = ""
      }
      break;
    }
  }
  return ret
}

export function Counter() {
  const [delta, setDelta] = useState("1");
  const [errStr, setErrStr] = useState("");

  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className="Container">
      <TonConnectButton />

      <DimCard>
        <FlexBoxCol>
          <h3>Simple Custom Smart Contract: Counter</h3>
          <FlexBoxRow>
            <b>Value</b>
            <div>{value ?? "Loading..."}</div>
          </FlexBoxRow>
          <FlexBoxRow>
            <label>Delta </label>
            <Input
              style={{ marginRight: 8 }}
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
            ></Input>
          </FlexBoxRow>
          <DimButton
            disabled={!connected}
            className={`Button ${connected ? "Active" : "Disabled"}`}
            onClick={() => {
              try {
                setErrStr("")
                sendIncrement(Number(delta));
                setErrStr("done")
              } catch (e: any) {
                setErrStr(e.toString())
              }
            }}
          >
            Increment
          </DimButton>
          Counter: {address}<br />
          {/* Telegram.WebApp.version: {window.Telegram.WebApp.version}<br /> */}
          TG username: {getTgUsername()}<br />
          {errStr}<br />
        </FlexBoxCol>
      </DimCard>
    </div>
  );
}
