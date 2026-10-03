"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export type EntityTableRow = {
  id: string;
  order: number;
  published?: boolean;
  [key: string]: unknown;
};

export type EntityTableColumn = {
  header: string;
  key: string;
  type?: "text" | "image";
};

export function EntityTable<T extends EntityTableRow>({
  rows,
  columns,
  apiBase,
  editBase,
  hasPublished = true,
}: {
  rows: T[];
  columns: EntityTableColumn[];
  apiBase: string;
  editBase: string;
  hasPublished?: boolean;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function togglePublished(row: T) {
    setBusyId(row.id);
    await fetch(`${apiBase}/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !row.published }),
    });
    setBusyId(null);
    router.refresh();
  }

  async function remove(row: T) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setBusyId(row.id);
    await fetch(`${apiBase}/${row.id}`, { method: "DELETE" });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-[14px] border border-[var(--color-omega-10)] bg-[var(--color-alpha)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-misty)] text-left text-[var(--color-omega-60)]">
          <tr>
            {columns.map((col) => (
              <th key={col.header} className="px-4 py-2 font-medium">
                {col.header}
              </th>
            ))}
            <th className="px-4 py-2 font-medium">Order</th>
            {hasPublished && <th className="px-4 py-2 font-medium">Published</th>}
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[var(--color-omega-10)]">
              {columns.map((col) => (
                <td key={col.header} className="px-4 py-2 align-top">
                  {col.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={String(row[col.key] ?? "")}
                      alt=""
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    String(row[col.key] ?? "")
                  )}
                </td>
              ))}
              <td className="px-4 py-2 align-top text-[var(--color-omega-60)]">{row.order}</td>
              {hasPublished && (
                <td className="px-4 py-2 align-top">
                  <Switch
                    checked={!!row.published}
                    disabled={busyId === row.id}
                    onCheckedChange={() => togglePublished(row)}
                  />
                </td>
              )}
              <td className="whitespace-nowrap px-4 py-2 align-top">
                <Link
                  href={`${editBase}/${row.id}`}
                  className="mr-3 text-[var(--color-link)] underline hover:text-white"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => remove(row)}
                  className="text-red-600 underline disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 3}
                className="px-4 py-8 text-center text-[var(--color-omega-40)]"
              >
                No items yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
