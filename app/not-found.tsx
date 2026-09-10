import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-10">
      <EmptyState
        title="That page is not on the wall."
        hint="The link may be out of date, or the listing may have been taken down."
        action={
          <Link href="/" className="btn-primary mt-2">
            Back to the wall
          </Link>
        }
      />
    </div>
  );
}
