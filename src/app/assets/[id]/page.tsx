"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

type AssetRecord = {
  id: string;
  title: string;
  description: string | null;
  fingerprint: string;
  created_at: string;
};

type AssetFile = {
  id: string;
  file_url: string;
  file_type: string;
};

export default function AssetDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [asset, setAsset] = useState<AssetRecord | null>(null);
  const [files, setFiles] = useState<AssetFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // 1) Load asset by its UUID
        const { data: assetData, error: assetError } = await supabase
          .from("assets")
          .select("id, title, description, fingerprint, created_at")
          .eq("id", id)
          .single();

        if (assetError || !assetData) {
          throw new Error("Asset not found.");
        }

        setAsset(assetData);

        // 2) Load associated files
        const { data: fileData, error: fileError } = await supabase
          .from("asset_files")
          .select("id, file_url, file_type")
          .eq("asset_id", id)
          .order("created_at", { ascending: true });

        if (fileError) {
          throw fileError;
        }

        setFiles(fileData ?? []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unable to load asset.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      load();
    }
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs text-slate-400 hover:text-slate-200 mb-3"
        >
          ← Back
        </button>

        <h1 className="text-xl font-semibold mb-4">Asset Details</h1>

        {loading ? (
          <p className="text-sm text-slate-400">Loading asset...</p>
        ) : error ? (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 rounded-md px-3 py-2">
            {error}
          </p>
        ) : asset ? (
          <div className="space-y-6">
            <section>
              <p className="text-xs text-slate-400 mb-1">Title</p>
              <p className="text-sm font-medium">{asset.title}</p>
            </section>

            {asset.description && (
              <section>
                <p className="text-xs text-slate-400 mb-1">Description</p>
                <p className="text-sm whitespace-pre-line">
                  {asset.description}
                </p>
              </section>
            )}

            <section>
              <p className="text-xs text-slate-400 mb-1">Created At</p>
              <p className="text-sm">
                {new Date(asset.created_at).toLocaleString()}
              </p>
            </section>

            <section>
              <p className="text-xs text-slate-400 mb-1">
                Fingerprint (SHA-256)
              </p>
              <p className="text-xs font-mono bg-slate-800 border border-slate-700 rounded-md px-3 py-2 break-all">
                {asset.fingerprint}
              </p>
            </section>

            <section>
              <p className="text-xs text-slate-400 mb-2">Uploaded Files</p>

              {files.length === 0 ? (
                <p className="text-sm text-slate-400">No files uploaded.</p>
              ) : (
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="border border-slate-800 rounded-md p-3 bg-slate-900/50"
                    >
                      <p className="text-xs text-slate-300 mb-2">
                        File type: {file.file_type}
                      </p>

                     
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}
