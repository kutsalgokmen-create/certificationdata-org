"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type ArchiveRow = {
  certificate_code: string;
  issued_at: string;
  asset_title: string;
  owner_name: string | null;
};

export default function ArchivePage() {
  const [rows, setRows] = useState<ArchiveRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.rpc("list_public_archive");

      if (error) {
        console.error("Archive load error:", error);
        setError(
          error.message ||
            "Could not load the public archive. Please try again later."
        );
        setRows([]);
      } else {
        setRows((data || []) as ArchiveRow[]);
      }

      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) => {
      return (
        row.asset_title.toLowerCase().includes(q) ||
        (row.owner_name || "").toLowerCase().includes(q) ||
        row.certificate_code.toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Başlık */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">
            Public Certificate Archive
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            A public archive of certificates issued on CertificationData. Only
            minimal information is shown: asset title, certified owner, issue
            time and certificate code. No contact details or file contents are
            displayed.
          </p>
        </div>

        {/* Arama kutusu */}
        <div className="mb-4">
          <label className="block text-xs text-slate-300 mb-1">
            Search by title, owner or certificate code
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to filter the archive..."
            className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Durumlar */}
        {loading ? (
          <p className="text-sm text-slate-400">Loading archive...</p>
        ) : error ? (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-400">
            No certificates found in the archive.
          </p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80">
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-300">
                    Asset title
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-300">
                    Certified owner
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-300">
                    Issued at
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-slate-300">
                    Certificate code
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.certificate_code}
                    className="border-b border-slate-800/80 hover:bg-slate-900"
                  >
                    <td className="px-3 py-2 text-slate-100">
                      {row.asset_title}
                    </td>
                    <td className="px-3 py-2 text-slate-200">
                      {row.owner_name || "—"}
                    </td>
                    <td className="px-3 py-2 text-slate-300 text-xs whitespace-nowrap">
                      {new Date(row.issued_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-slate-200 font-mono text-xs">
                      {row.certificate_code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="px-3 py-2 text-[11px] text-slate-500 border-t border-slate-800">
              Only minimal metadata is published here. File contents, download
              links and contact details remain private to the certificate owner.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
