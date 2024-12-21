import './Panel.css';

interface PanelProps {
  skinName: string;
  description: string;
  tonPrice: number;
  starsPrice: number;
  onPayWithTON: (skinName: string, tonPrice: number) => void;
  onPayWithStars: (skinName: string, starsPrice: number) => void;
}

function Panel({skinName,description,tonPrice,starsPrice,onPayWithTON,onPayWithStars,}: PanelProps) {
  return (
    <div className="Panel">
      <h1>{skinName}</h1>
      <p>{description}</p>

      <p><b>Price in TON:</b> {tonPrice} TON</p>
      <p><b>Price in Stars:</b> {starsPrice} XTR</p>

      <div className="PaymentButtons">
        <button onClick={() => onPayWithTON(skinName, tonPrice)} className="PaymentButton">Pay with TON</button>
        <button onClick={() => onPayWithStars(skinName, starsPrice)} className="PaymentButton">Pay with Stars</button>
      </div>
    </div>
  );
}

export default Panel;


