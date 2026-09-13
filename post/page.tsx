import { redirect } from "next/navigation";
import { PostListingForm } from "@/components/PostListingForm";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata = { title: "Post a listing | UniShare" };

export default async function PostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?next=/post");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="max-w-[50ch]">
        <h1 className="font-display text-[32px] font-extrabold leading-tight">
          Pin something to the wall
        </h1>
        <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">
          Your listing appears on the wall straight away. Students will contact
          you through the methods you choose below.
        </p>
      </header>
      <PostListingForm />
    </div>
  );
}
