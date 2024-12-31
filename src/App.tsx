import "./App.css";
import React  from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import  WebApp from '@twa-dev/sdk';
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

  const [logs, setLogs] = React.useState<string[]>([]);
  const log = (message: string) => {
    console.log(message);
    setLogs((prevLogs) => [...prevLogs, message]);
  };
  React.useEffect(() => {
    // Log WebApp version and platform at the start
  
    log(`WebApp Version: ${WebApp.version || "Unknown"}`);
    log(`Platform: ${WebApp.platform || "Unknown"}`);
  }, []);
  
  console.log("Is connected:", connected);

  const handlePayWithTON = (skinName: string, tonPrice: number) => {
    console.log(`Paying with TON for ${skinName}, price: ${tonPrice} TON`);
    log(`Paying with TON for ${skinName}, price: ${tonPrice} TON`);
  };

  const handlePayWithStars = async (skinName: string, starsPrice: number) => {
    console.log(`Paying with Stars for ${skinName}, price: ${starsPrice} XTR`);
    log(`Paying with Stars for ${skinName}, price: ${starsPrice} XTR`);
  
    try {
      log("Sending request to create invoice...");
      // 1. Call your server's /create-invoice endpoint
      const response = await fetch("https://ee6e-217-61-226-17.ngrok-free.app/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skinName, starsPrice }),
      });
    
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      const invoiceLink = data.invoiceLink;
      console.log("Invoice link received:", invoiceLink);
      log(`Invoice link received: ${invoiceLink}`);

      // 2. Use Telegram WebApp SDK to open the invoice
      if (WebApp.openInvoice) {
        WebApp.openInvoice(invoiceLink, (status) => {
          if (status === "paid") {
            log("Payment successful!");
            console.log("Payment successful!");
            alert("Payment successful!");
          } else if (status === "cancelled") {
            log("Payment was cancelled.");
            console.log("Payment was cancelled.");
            alert("Payment was cancelled.");
          } else {
            log("Payment failed or was closed.");
            console.log("Payment failed or was closed.");
            alert("Payment failed or was closed.");
          }
        });
      } else {
        log("openInvoice is not supported. Opening link in a new tab.");
        console.warn("openInvoice is not supported. Opening link directly.");
        window.open(invoiceLink, "_blank"); // Open the invoice in a browser
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Error in handlePayWithStars: ${errorMessage}`);
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
            <h3>Logs</h3>
              <ul>
                {logs.map((log, index) => (<li key={index}>{log}</li>))}
              </ul>
            </div>
          <div className="Card">
            <b>WebApp Version</b>
            <div>{WebApp.version || "Unknown"}</div>

            <b>Platform</b>
            <div>{WebApp.platform || "Unknown"}</div>

            <b>Our Contract Address</b>
            <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>

            <b>Our Contract Balance</b>
            {contract_balance && <div className="Hint">{fromNano(contract_balance)}</div>}
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