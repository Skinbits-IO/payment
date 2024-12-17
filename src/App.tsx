import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import WebApp from '@twa-dev/sdk';
import Panel from './components/panel.tsx';

function App() {
  const {
    contract_address,
    counter_value,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest
  } = useMainContract();

  const { connected } = useTonConnect();

  const handlePayWithTON = (skinName: string, price: number) => {
    console.log(`Paying with TON for ${skinName} at ${price} TON.`);
  };

  const handlePayWithStars = (skinName: string, price: number) => {
    console.log(`Paying with Stars for ${skinName} at ${price} TON equivalent.`);
  };

  return (
    <div>
      {!connected ? (
        // If not connected, center the TonConnectButton
        <div className="CenterContainer">
          <TonConnectButton />
        </div>
      ) : (
        // Once connected, move the TonConnectButton to the top-right and show the panels
        <>
          <div className="TonConnectContainer">
            <TonConnectButton />
          </div>

          <div className="Container">
            <Panel
              skinName="CS2 Skin 1"
              description="A cool skin for CS2 with excellent graphics and design."
              price={1.5} // Price in TON
              onPayWithTON={handlePayWithTON}
              onPayWithStars={handlePayWithStars}
            />
            <Panel
              skinName="CS2 Skin 2"
              description="A cool skin for CS2 with excellent graphics and design."
              price={2.0}
              onPayWithTON={handlePayWithTON}
              onPayWithStars={handlePayWithStars}
            />
            <Panel
              skinName="CS2 Skin 3"
              description="A cool skin for CS2 with excellent graphics and design."
              price={3.25}
              onPayWithTON={handlePayWithTON}
              onPayWithStars={handlePayWithStars}
            />
          </div>

          <div>
            <div className='Card'>
              <b>{WebApp.platform}</b>
              <b>Our contract Address</b>
              <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
              <b>Our contract Balance</b>
              {contract_balance && (
                <div className='Hint'>{fromNano(contract_balance)}</div>
              )}
            </div>

            <div className='Card'>
              <b>Counter Value</b>
              <div>{counter_value ?? "Loading..."}</div>
            </div>

            <br/>

            <a onClick={() => sendIncrement()}>
              Increment by 5
            </a>
            <br/>

            <a onClick={() => sendDeposit()}>
              Request deposit of 1 TON
            </a>
            <br/>

            <a onClick={() => sendWithdrawalRequest()}>
              Request 0.7 TON withdrawal
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default App;