import React, { useState } from 'react';
import type { TableRow as TableRowType } from '../types';

interface Props {
  row: TableRowType;
  level?: number;
  onValueChange: (id: string, newValue: number) => void;
}

export function TableRow({ row, level = 0, onValueChange }: Props) {
  const [inputValue, setInputValue] = useState('');
  const originalValue = row.originalValue ?? row.value;
  const variance = ((row.value - originalValue) / originalValue) * 100;

  const handleAllocationPercentage = () => {
    if (!inputValue) return;
    const percentage = parseFloat(inputValue);
    if (isNaN(percentage)) return;

    const increase = row.value * (percentage / 100);
    onValueChange(row.id, row.value + increase);
  };

  const handleAllocationValue = () => {
    if (!inputValue) return;
    const newValue = parseFloat(inputValue);
    if (isNaN(newValue)) return;

    onValueChange(row.id, newValue);
  };

  return (
    <>
      <tr className="border-b align-middle">
        <td className="py-3 px-4 text-left whitespace-nowrap">
          <div className="flex items-center">
            <span className="ml-[calc(20px*var(--level))]" style={{ '--level': level } as React.CSSProperties}>
              {level > 0 ? '↳ ' : ''}
              {row.label}
            </span>
          </div>
        </td>

        <td className="py-3 px-4 text-right">{row.value.toFixed(2)}</td>

        <td className="py-3 px-4 text-center">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full max-w-[100px] px-2 py-1 border rounded text-sm text-right"
            placeholder="Enter Value"
          />
        </td>

        <td className="py-3 px-4 text-center">
          <button
            onClick={handleAllocationPercentage}
            className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
          >
            Allocation %
          </button>
        </td>

        <td className="py-3 px-4 text-center">
          <button
            onClick={handleAllocationValue}
            className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600"
          >
            Allocation Value
          </button>
        </td>

        <td className="py-3 px-4 text-right text-sm">
          {variance.toFixed(2)}%
        </td>
      </tr>

      {row.children?.map((child) => (
        <TableRow key={child.id} row={child} level={level + 1} onValueChange={onValueChange} />
      ))}
    </>
  );
}