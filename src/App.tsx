import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";

import WebApp from '@twa-dev/sdk'
import Panel from './components/panel.tsx'

//WebApp.showAlert('Hey there!');

function App() {
  const {
    contract_address,
    counter_value,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest
  } = useMainContract();

  const {connected } = useTonConnect();
  const handlePayWithTON = (skinName: string) => {
    console.log(`Paying with TON for skin: ${skinName}`);
  };

  const handlePayWithStars = (skinName: string) => {
    console.log(`Paying with Stars for skin: ${skinName}`);
  };

//const showAlert = () => {
 // WebApp.showAlert("Hey there!");
//};

  return (
    <div>
      <div>
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
      </div>

      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>{WebApp.platform}</b>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contract_balance &&
            <div className='Hint'>{fromNano(contract_balance)}</div>

          }
          
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>

        {connected && (
        <a onClick={ () => {
         //showAlert();
        }}
        >
          Show Alert
        </a>
      )}

      <br/>

      {connected && (
        <a onClick={ () => {
          sendIncrement();
        }}
        >
          Increment by 5
        </a>
      )}
      <br/>

       {connected && (
        <a onClick={ () => {
          sendDeposit();
        }}
        >
          Request deposit of 1 TON
        </a>
      )} 

      <br/>

      {connected && (
        <a onClick={ () => {
          sendWithdrawalRequest();
      }}
      >
        Request  0.7 TON withdrawal
      </a>
      )} 
      </div>
    </div>
  );
}

export default App;
