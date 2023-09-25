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

import { Telegram, WebAppUser } from "@twa-dev/types"
declare global {
  interface Window {
    Telegram: Telegram;
    WebAppUser: WebAppUser;
  }
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
          @twa-dev/types<br />
          Telegram.WebApp.version: {window.Telegram.WebApp.version}<br />
          WebAppUser.id: {window.WebAppUser?.id}<br />
          WebAppUser.first_name: {window.WebAppUser?.first_name}<br />
          WebAppUser.last_name: {window.WebAppUser?.last_name}<br />
          WebAppUser.username: {window.WebAppUser?.username}<br />
          WebAppUser.language_code: {window.WebAppUser?.language_code}<br />
        </FlexBoxCol>
      </Card>
    </div>
  );
}
