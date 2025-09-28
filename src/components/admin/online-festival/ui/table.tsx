import React from 'react'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '', ...props }: TableProps) {
  return (
    <div className="overflow-auto">
      <table className={`w-full text-sm ${className}`} {...props}>
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
  className?: string
}

export function TableHeader({ children, className = '', ...props }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  )
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
  className?: string
}

export function TableBody({ children, className = '', ...props }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`} {...props}>
      {children}
    </tbody>
  )
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  className?: string
}

export function TableRow({ children, className = '', ...props }: TableRowProps) {
  return (
    <tr className={`hover:bg-gray-50 ${className}`} {...props}>
      {children}
    </tr>
  )
}

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  className?: string
}

export function TableHead({ children, className = '', ...props }: TableHeadProps) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </th>
  )
}

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
  className?: string
}

export function TableCell({ children, className = '', ...props }: TableCellProps) {
  return (
    <td className={`px-4 py-3 text-gray-900 ${className}`} {...props}>
      {children}
    </td>
  )
}