import { notFound, redirect } from "next/navigation";
import { PostListingForm } from "@/components/PostListingForm";
import { getListingById } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "Edit listing | UniShare" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/account/listings/${id}/edit`);

  const listing = await getListingById(id);
  if (!listing) notFound();

  // Row Level Security blocks the write as well. This is the friendly version.
  if (listing.user_id !== user.id) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="notice">
          You can only edit listings that you posted yourself.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-[32px] font-extrabold leading-tight">
          Edit listing
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Changes appear on the wall as soon as you save.
        </p>
      </header>
      <PostListingForm existing={listing} />
    </div>
  );
}
