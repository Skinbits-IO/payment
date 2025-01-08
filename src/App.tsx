import "./App.css";
import React  from "react";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano} from "ton-core";
import  WebApp from '@twa-dev/sdk';
import Panel from './components/panel.tsx';

//const CONTRACT_ADDRESS = "0QDUmpYN6mzBj-xSBLqlyTxL768tqlqlqA4fqG8NXqejxXG4";
function App() {
  const {
    contract_address,
    counter_value,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
    sendPurchase
  } = useMainContract();

  
  const { connected } = useTonConnect();

  const [logs, setLogs] = React.useState<string[]>([]);
  const [starsAmount, setStarsAmount] = React.useState<number>(0);
  const [password, setPassword] = React.useState<string>("");

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

  const handlePayWithTON = async (skinName: string, tonPrice: number) => {
    try {
      log(`Initiating purchase with TON for ${skinName}, price: ${tonPrice} TON`);
      await sendPurchase(tonPrice, skinName);
      log("TON purchase successful!");
      alert(`Payment for ${skinName} completed successfully.`);
    } catch (error) {
      console.error("Error in handlePayWithTON:", error);
      log("TON purchase failed or was cancelled.");
      alert("Payment failed or was cancelled.");
    }
  };
  
  

  const handlePayWithStars = async (skinName: string, starsPrice: number) => {
    console.log(`Paying with Stars for ${skinName}, price: ${starsPrice} XTR`);
    log(`Paying with Stars for ${skinName}, price: ${starsPrice} XTR`);
  
    try {
      log("Sending request to create invoice...");
      // 1. Call your server's /create-invoice endpoint
      const response = await fetch("https://4721-217-61-226-17.ngrok-free.app/create-invoice", {
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

  const handleWithdrawStars = async (starsAmount: number, password: string) => {
    console.log(`Requesting withdrawal of ${starsAmount} Stars`);
    log(`Requesting withdrawal of ${starsAmount} Stars`);
    try {
      // Call the server's /withdraw-stars endpoint
      const response = await fetch("https://4721-217-61-226-17.ngrok-free.app/withdraw-stars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starsAmount, password }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
  
      const data = await response.json();
      const withdrawalUrl = data.withdrawalUrl;
      console.log("Withdrawal URL received:", withdrawalUrl);
      log(`Withdrawal URL received: ${withdrawalUrl}`);
      
      // Open the Fragment withdrawal page in a new tab
      window.open(withdrawalUrl, "_blank");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Error in handleWithdrawStars: ${errorMessage}`);
      console.error("Error in handleWithdrawStars:", error);
      alert(`Failed to request withdrawal: ${errorMessage}`);
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
              tonPrice={0}       // Price in TON
              starsPrice={1}  // Price in TON
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

          <div className="Card">
              <b>Withdraw Stars</b>
              <div>
                <input
                  type="number"
                  placeholder="Stars Amount"
                  value={starsAmount} // Bind state
                  onChange={(e) => setStarsAmount(Number(e.target.value))} // Update state
                />
                <input
                  type="password"
                  placeholder="2FA Password"
                  value={password} // Bind state
                  onChange={(e) => setPassword(e.target.value)} // Update state
                />
                <button onClick={() => handleWithdrawStars(starsAmount, password)}>
                  Withdraw Stars
                </button>
              </div>
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