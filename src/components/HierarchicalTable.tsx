import React, { useState, useEffect } from 'react';
import { TableRow } from './TableRow';
import type { TableData, TableRow as TableRowType } from '../types';

interface Props {
  initialData: TableData;
}

export function HierarchicalTable({ initialData }: Props) {
  const [data, setData] = useState<TableData>(() => {
    const processRow = (row: TableRowType): TableRowType => ({
      ...row,
      originalValue: row.value,
      children: row.children?.map(processRow)
    });
    
    return {
      rows: initialData.rows.map(processRow)
    };
  });

  const calculateTotal = (rows: TableRowType[]): number => {
    return rows.reduce((sum, row) => sum + row.value, 0);
  };

  const updateParentValues = (rows: TableRowType[]): TableRowType[] => {
    return rows.map(row => {
      if (row.children) {
        const children = updateParentValues(row.children);
        return {
          ...row,
          value: calculateTotal(children),
          children
        };
      }
      return row;
    });
  };

  const distributeToChildren = (row: TableRowType, newValue: number): TableRowType => {
    if (!row.children) return { ...row, value: newValue };

    const totalChildrenValue = calculateTotal(row.children);
    const ratio = newValue / totalChildrenValue;

    return {
      ...row,
      value: newValue,
      children: row.children.map(child => ({
        ...child,
        value: child.value * ratio
      }))
    };
  };

  const handleValueChange = (id: string, newValue: number) => {
    const updateRows = (rows: TableRowType[]): TableRowType[] => {
      return rows.map(row => {
        if (row.id === id) {
          return distributeToChildren(row, newValue);
        }
        if (row.children) {
          return {
            ...row,
            children: updateRows(row.children)
          };
        }
        return row;
      });
    };

    setData(prevData => {
      const updatedRows = updateRows(prevData.rows);
      return {
        rows: updateParentValues(updatedRows)
      };
    });
  };

  const grandTotal = calculateTotal(data.rows);
  const originalGrandTotal = calculateTotal(initialData.rows);
  const grandTotalVariance = ((grandTotal - originalGrandTotal) / originalGrandTotal) * 100;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3 px-4 text-left">Label</th>
            <th className="py-3 px-4 text-right">Value</th>
            <th className="py-3 px-4">Input</th>
            <th className="py-3 px-4">Allocation %</th>
            <th className="py-3 px-4">Allocation Val</th>
            <th className="py-3 px-4 text-right">Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              onValueChange={handleValueChange}
            />
          ))}
          <tr className="bg-gray-50 font-bold">
            <td className="py-3 px-4">Grand Total</td>
            <td className="py-3 px-4 text-right">{grandTotal.toFixed(2)}</td>
            <td className="py-3 px-4"></td>
            <td className="py-3 px-4"></td>
            <td className="py-3 px-4"></td>
            <td className="py-3 px-4 text-right">{grandTotalVariance.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}