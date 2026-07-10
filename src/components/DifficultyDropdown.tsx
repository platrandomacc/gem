import { difficultyModes, TowerDifficulty } from '../utils/multipliers';
import { Dropdown } from './ui/Dropdown';

interface DifficultyDropdownProps {
  value: TowerDifficulty;
  onChange: (value: TowerDifficulty) => void;
}

export function DifficultyDropdown({ value, onChange }: DifficultyDropdownProps) {
  const options = difficultyModes.map((mode) => ({
    label: mode.label,
    value: mode.value,
    description: mode.description,
  }));

  return <Dropdown label="Difficulty" options={options} value={value} onChange={(nextValue) => onChange(nextValue as TowerDifficulty)} className="max-w-xs" compact />;
}
