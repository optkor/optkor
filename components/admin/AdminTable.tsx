import { cn } from "@/lib/utils/cn"

export type AdminColumn<T> = {
  header: string
  className?: string
  render: (row: T) => React.ReactNode
}

export function AdminTable<T extends { id: string }>({
  columns,
  rows,
}: {
  columns: AdminColumn<T>[]
  rows: T[]
}) {
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            {columns.map((col) => (
              <th
                key={col.header}
                className={cn(
                  "px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted",
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-line last:border-b-0 hover:bg-ink-2">
              {columns.map((col) => (
                <td key={col.header} className={cn("px-4 py-4 align-middle text-paper", col.className)}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
