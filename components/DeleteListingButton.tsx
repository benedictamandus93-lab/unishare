"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { friendlyError } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

export function DeleteListingButton({ listingId }: { listingId: string }) {
  const { supabase } = useAuth();
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setBusy(true);
    setError(null);
    const { error: deleteError } = await supabase
      .from("listings")
      .delete()
      .eq("id", listingId);
    setBusy(false);

    if (deleteError) {
      setError(friendlyError(deleteError.message));
      return;
    }
    router.push("/account/listings");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="btn-quiet text-services-ink"
      >
        Delete
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[14px] text-ink-soft">Remove this listing?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={busy}
        className="btn-quiet border-services-ink text-services-ink"
      >
        {busy ? "Removing" : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="btn-quiet"
      >
        Keep it
      </button>
      {error && (
        <span role="alert" className="text-[13px] text-services-ink">
          {error}
        </span>
      )}
    </div>
  );
}
