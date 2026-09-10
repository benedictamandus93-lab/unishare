import Link from "next/link";
import { redirect } from "next/navigation";
import { getMyListings } from "@/lib/listings";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "My account | UniShare" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/account");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name,university_email")
    .eq("id", user.id)
    .maybeSingle();

  const name =
    profile?.name ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Student";

  const listings = await getMyListings(user.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-[32px] font-extrabold leading-tight">
          Welcome, {name}
        </h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          {profile?.university_email ?? user.email}
        </p>
      </header>

      <div className="sheet divide-y divide-board-line">
        <Link href="/account/listings" className="flex items-center justify-between gap-4 p-5 hover:bg-board/50">
          <span>
            <span className="block text-[16px] font-semibold">My listings</span>
            <span className="mt-0.5 block text-[14px] text-ink-soft">
              {listings.length === 0
                ? "You have not posted anything yet."
                : `${listings.length} ${listings.length === 1 ? "listing" : "listings"} on the wall`}
            </span>
          </span>
          <span aria-hidden="true" className="text-[20px] text-ink-faint">›</span>
        </Link>

        <Link href="/post" className="flex items-center justify-between gap-4 p-5 hover:bg-board/50">
          <span>
            <span className="block text-[16px] font-semibold">Post a listing</span>
            <span className="mt-0.5 block text-[14px] text-ink-soft">
              Add something to buy, rent or a service you can offer
            </span>
          </span>
          <span aria-hidden="true" className="text-[20px] text-ink-faint">›</span>
        </Link>
      </div>
    </div>
  );
}
