
import React from 'react';
import { MasterRecord } from '../types';

interface DataTableProps {
  data: MasterRecord[];
}

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400">No data to display.</p>;
  }

  const headers = Object.keys(data[0]) as (keyof MasterRecord)[];

  const formatHeader = (header: string) => {
      return header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <div className="overflow-x-auto rounded-lg ring-1 ring-slate-200 dark:ring-slate-700">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-100 dark:bg-slate-800">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-slate-100"
              >
                {formatHeader(header)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800/50">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
              {headers.map((header) => (
                <td key={header} className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {String(row[header] === null ? 'N/A' : row[header])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
