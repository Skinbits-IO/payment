import './Panel.css';

interface PanelProps {
  skinName: string;
  description: string;
  price: number; // Price in TON or another metric
  onPayWithTON: (skinName: string, price: number) => void;
  onPayWithStars: (skinName: string, price: number) => void;
}

function Panel({ skinName, description, price, onPayWithTON, onPayWithStars }: PanelProps) {
  return (
    <div className="Panel">
      <h1>{skinName}</h1>
      <p>{description}</p>
      <p><b>Price:</b> {price} TON</p>
      <div className="PaymentButtons">
        <button onClick={() => onPayWithTON(skinName, price)}>Pay with TON</button>
        <button onClick={() => onPayWithStars(skinName, price)}>Pay with Stars</button>
      </div>
    </div>
  );
}

export default Panel;

