
import './Panel.css';

interface PanelProps {
    skinName: string;
    description: string;
    onPayWithTON: () => void;
    onPayWithStars: () => void;
  }
  
function Panel({ skinName, description, onPayWithTON, onPayWithStars }: PanelProps) {
    return (
      <div className="Panel">
        <h1>{skinName}</h1>
        <p>{description}</p>
        <div className="PaymentButtons">
          <button onClick={onPayWithTON} className="PaymentButton">Pay with TON</button>
          <button onClick={onPayWithStars} className="PaymentButton">Pay with Stars</button>
        </div>
      </div>
    );
  }

export default Panel

