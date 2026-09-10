import type { Listing } from "@/lib/types";
import { contactLinks } from "@/lib/utils";

/**
 * UniShare has no internal messaging. These links hand the conversation over
 * to whichever app the student already uses.
 */
export function ContactButtons({ listing }: { listing: Listing }) {
  const links = contactLinks(listing);
  const available = [
    links.whatsapp && {
      key: "whatsapp",
      label: "WhatsApp",
      href: links.whatsapp,
      external: true,
      className: "bg-rent-ink text-white hover:opacity-90",
    },
    links.sms && {
      key: "sms",
      label: "Text message",
      href: links.sms,
      external: false,
      className: "bg-services-ink text-white hover:opacity-90",
    },
    links.email && {
      key: "email",
      label: "Email",
      href: links.email,
      external: false,
      className: "bg-varsity text-white hover:opacity-90",
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    href: string;
    external: boolean;
    className: string;
  }[];

  if (available.length === 0) {
    return (
      <p className="text-[15px] text-ink-soft">
        This student did not leave a contact method.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        {available.map((item) => (
          <a
            key={item.key}
            href={item.href}
            {...(item.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className={`inline-flex min-h-[46px] flex-1 items-center justify-center rounded-sheet px-5 text-[15px] font-semibold transition-opacity sm:flex-none ${item.className}`}
          >
            {item.label}
          </a>
        ))}
      </div>
      <p className="text-[13px] leading-relaxed text-ink-faint">
        These buttons open your own email, WhatsApp or messaging app with the
        details filled in. UniShare does not send the message for you.
      </p>
    </div>
  );
}
