import Link from "next/link";

export const metadata = { title: "Confirm your email | UniShare" };

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-md py-4">
      <div className="sheet space-y-4 p-6">
        <h1 className="font-display text-[26px] font-bold">
          Check your university inbox
        </h1>
        <p className="text-[15px] leading-relaxed text-ink-soft">
          UniShare has sent a confirmation link to your University of Auckland
          address. Open that link to activate your account, then come back and
          log in.
        </p>
        <p className="text-[14px] leading-relaxed text-ink-faint">
          If nothing arrives within a few minutes, check your junk folder and
          confirm that the address you typed is correct.
        </p>
        <Link href="/login" className="btn-primary w-full">
          Go to log in
        </Link>
      </div>
    </div>
  );
}
