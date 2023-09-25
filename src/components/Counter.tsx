import { TonConnectButton } from "@tonconnect/ui-react";
import { useCounterContract } from "../hooks/useCounterContract";
import { useTonConnect } from "../hooks/useTonConnect";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  Button,
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
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    <div className="Container">
      <TonConnectButton />

      <Card>
        <FlexBoxCol>
          <h3>Counter</h3>
          <FlexBoxRow>
            <b>Address</b>
            <Ellipsis>{address}</Ellipsis>
          </FlexBoxRow>
          <FlexBoxRow>
            <b>Value</b>
            <div>{value ?? "Loading..."}</div>
          </FlexBoxRow>
          <Button
            disabled={!connected}
            className={`Button ${connected ? "Active" : "Disabled"}`}
            onClick={() => {
              sendIncrement();
            }}
          >
            Increment
          </Button>
          Telegram.WebApp.version: {window.Telegram.WebApp.version}<br />
          TG username: {getTgUsername()}<br />
        </FlexBoxCol>
      </Card>
    </div>
  );
}
