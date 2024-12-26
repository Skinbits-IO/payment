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
  
  console.log("Is connected:", connected);

  const handlePayWithTON = (skinName: string, tonPrice: number) => {
    console.log(`Paying with TON for ${skinName}, price: ${tonPrice} TON`);
  };

  const handlePayWithStars = async (skinName: string, starsPrice: number) => {
    console.log(`Paying with Stars for ${skinName}, price: ${starsPrice} XTR`);
  
    try {
      // 1. Call your server's /create-invoice endpoint
      const response = await fetch("http://localhost:3000/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skinName, starsPrice }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
     
      console.log("WebApp version:", WebApp.version);
      console.log("Is running inside Telegram:", WebApp.initData !== "");
      console.log("tgWebVersion:", window.Telegram.WebView.initParams?.tgWebVersion);
      console.log("Hardcoded WebApp version:", window.Telegram.WebApp.version); 

      const data = await response.json(); 
      const invoiceLink = data.invoiceLink;
      console.log("Invoice link received:", invoiceLink);
  
      // 2. Use Telegram WebApp SDK to open the invoice
      if (window.Telegram.WebApp.openInvoice) {
        window.Telegram.WebApp.openInvoice(invoiceLink, (status) => {
          if (status === "paid") {
            console.log("Payment successful!");
            alert("Payment successful!");
          } else if (status === "cancelled") {
            console.log("Payment was cancelled.");
            alert("Payment was cancelled.");
          } else {
            console.log("Payment failed or was closed.");
            alert("Payment failed or was closed.");
          }
        });
      } else {
        console.warn("openInvoice is not supported. Opening link directly.");
        alert("Your Telegram app does not support in-app payments. Opening payment link in a new tab.");
        window.open(invoiceLink, "_blank");
      }
    } catch (error) {
      console.error("Error in handlePayWithStars:", error);
    }
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
              tonPrice={1.5}       // Price in TON
              starsPrice={150}  // Price in TON
              onPayWithTON={handlePayWithTON}
              onPayWithStars={handlePayWithStars}
            />
            <Panel
              skinName="CS2 Skin 2"
              description="A cool skin for CS2 with excellent graphics and design."
              tonPrice={1.5}       // Price in TON
              starsPrice={150} 
              onPayWithTON={handlePayWithTON}
              onPayWithStars={handlePayWithStars}
            />
            <Panel
              skinName="CS2 Skin 3"
              description="A cool skin for CS2 with excellent graphics and design."
              tonPrice={1.5}       // Price in TON
              starsPrice={150} 
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