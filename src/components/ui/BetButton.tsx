import { Button } from './Button';

interface BetButtonProps {
  amount: number;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  className?: string;
  sharp?: boolean;
}

export function BetButton({ amount, onClick, disabled = false, variant = 'primary', className = '', sharp = false }: BetButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled} variant={variant} sharp={sharp} className={className}>
      {`Bet $${Number(amount).toFixed(2)}`}
    </Button>
  );
}
