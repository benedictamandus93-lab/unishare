import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-board-line bg-board-deep/60">
      <div className="mx-auto flex max-w-wall flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-[19px] font-bold">UniShare</p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
            A student noticeboard for the University of Auckland. Post what you
            have, find what you need, then talk to each other directly.
          </p>
        </div>

        <nav aria-label="Footer" className="flex gap-10 text-[14px]">
          <div className="space-y-2">
            <p className="font-semibold">Browse</p>
            <Link href="/buy" className="block text-ink-soft hover:text-ink">Buy</Link>
            <Link href="/rent" className="block text-ink-soft hover:text-ink">Rent</Link>
            <Link href="/services" className="block text-ink-soft hover:text-ink">Services</Link>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Account</p>
            <Link href="/login" className="block text-ink-soft hover:text-ink">Log in</Link>
            <Link href="/register" className="block text-ink-soft hover:text-ink">Register</Link>
            <Link href="/post" className="block text-ink-soft hover:text-ink">Post a listing</Link>
          </div>
        </nav>
      </div>

      <div className="border-t border-board-line px-4 py-4 sm:px-6">
        <p className="mx-auto max-w-wall text-[13px] text-ink-faint">
          Student prototype. All listings and contact details shown by default
          are fictional.
        </p>
      </div>
    </footer>
  );
}
