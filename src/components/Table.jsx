import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-auto w-full">
      <table className="min-w-full text-left table-auto">
        <thead>
          <tr className="text-sm text-muted">
            {columns.map((col) => (
              <th key={col.key} className="p-2">
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-t border-white/6">
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
