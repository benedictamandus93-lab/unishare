"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CATEGORIES,
  DIRECTIONS,
  MAX_IMAGE_BYTES,
  PRICE_UNITS,
  STORAGE_BUCKET,
  SUBCATEGORIES,
} from "@/lib/constants";
import type {
  Category,
  Direction,
  Listing,
  PriceUnit,
  Subcategory,
} from "@/lib/types";
import { friendlyError, isValidEmail, normalisePhone } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

export function PostListingForm({ existing }: { existing?: Listing }) {
  const { supabase, user, displayName } = useAuth();
  const router = useRouter();
  const editing = Boolean(existing);

  const [direction, setDirection] = useState<Direction>(
    existing?.direction ?? "offering",
  );
  const [category, setCategory] = useState<Category>(existing?.category ?? "buy");
  const [subcategory, setSubcategory] = useState<Subcategory>(
    existing?.subcategory ?? "photography",
  );
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [price, setPrice] = useState(
    existing ? String(existing.price) : "",
  );
  const [priceUnit, setPriceUnit] = useState<PriceUnit>(
    existing?.price_unit ?? "fixed",
  );

  const [useEmail, setUseEmail] = useState(Boolean(existing?.email_contact));
  const [useWhatsapp, setUseWhatsapp] = useState(
    Boolean(existing?.whatsapp_contact),
  );
  const [useSms, setUseSms] = useState(Boolean(existing?.sms_contact));
  const [emailValue, setEmailValue] = useState(existing?.email_contact ?? "");
  const [whatsappValue, setWhatsappValue] = useState(
    existing?.whatsapp_contact ?? "",
  );
  const [smsValue, setSmsValue] = useState(existing?.sms_contact ?? "");

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    existing?.image_url ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function handleFile(selected: File | null) {
    setError(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (selected.size > MAX_IMAGE_BYTES) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function uploadImage(userId: string): Promise<string | null> {
    if (!file) return existing?.image_url ?? null;

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    // The first folder must be the user id, which is what the storage policy checks.
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!user) {
      setError("Please log in before posting a listing.");
      return;
    }
    if (title.trim().length === 0) {
      setError("Please enter a listing title.");
      return;
    }
    if (description.trim().length < 10) {
      setError("Please write a short description of at least 10 characters.");
      return;
    }
    const priceNumber = Number(price);
    if (!price.trim() || Number.isNaN(priceNumber) || priceNumber < 0) {
      setError(
        direction === "wanted"
          ? "Please enter your budget as a number, for example 40."
          : "Please enter a price as a number, for example 40.",
      );
      return;
    }
    if (!useEmail && !useWhatsapp && !useSms) {
      setError("Please provide at least one contact method.");
      return;
    }
    if (useEmail && !isValidEmail(emailValue)) {
      setError("Please enter a valid contact email address.");
      return;
    }
    if (useWhatsapp && normalisePhone(whatsappValue).length < 8) {
      setError(
        "Please enter a WhatsApp number including the country code, for example 6421234567.",
      );
      return;
    }
    if (useSms && normalisePhone(smsValue).length < 8) {
      setError("Please enter a valid mobile number for text messages.");
      return;
    }

    setBusy(true);
    try {
      const imageUrl = await uploadImage(user.id);

      const payload = {
        user_id: user.id,
        poster_name: displayName,
        direction,
        category,
        subcategory: category === "services" ? subcategory : null,
        title: title.trim(),
        description: description.trim(),
        price: priceNumber,
        price_unit: priceUnit,
        image_url: imageUrl,
        email_contact: useEmail ? emailValue.trim() : null,
        whatsapp_contact: useWhatsapp ? normalisePhone(whatsappValue) : null,
        sms_contact: useSms ? normalisePhone(smsValue) : null,
      };

      if (editing && existing) {
        const { error: updateError } = await supabase
          .from("listings")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", existing.id);
        if (updateError) throw new Error(updateError.message);
        router.push(`/listing/${existing.id}`);
      } else {
        const { data, error: insertError } = await supabase
          .from("listings")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw new Error(insertError.message);
        router.push(`/listing/${data.id}`);
      }
      router.refresh();
    } catch (caught) {
      setError(friendlyError((caught as Error).message));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {error && (
        <p role="alert" className="notice">
          {error}
        </p>
      )}

      <fieldset className="sheet space-y-4 p-5">
        <legend className="px-1 font-display text-[17px] font-semibold">
          Are you offering something, or looking for something?
        </legend>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {DIRECTIONS.map((option) => {
            const active = direction === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-sheet border px-4 py-3 transition-colors ${
                  active
                    ? "border-varsity bg-varsity/5"
                    : "border-board-line hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="direction"
                  value={option.value}
                  checked={active}
                  onChange={() => setDirection(option.value)}
                  className="sr-only"
                />
                <span className="block text-[15px] font-semibold">
                  {option.label}
                </span>
                <span className="block text-[13px] text-ink-soft">
                  {option.blurb}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="sheet space-y-4 p-5">
        <legend className="px-1 font-display text-[17px] font-semibold">
          {direction === "wanted"
            ? "What kind of thing are you after?"
            : "What are you posting?"}
        </legend>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {CATEGORIES.map((option) => {
            const active = category === option.value;
            return (
              <label
                key={option.value}
                className={`cursor-pointer rounded-sheet border px-4 py-3 transition-colors ${
                  active
                    ? "border-varsity bg-varsity/5"
                    : "border-board-line hover:border-ink-faint"
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={option.value}
                  checked={active}
                  onChange={() => setCategory(option.value)}
                  className="sr-only"
                />
                <span className="block text-[15px] font-semibold">
                  {option.label}
                </span>
                <span className="block text-[13px] text-ink-soft">
                  {option.blurb}
                </span>
              </label>
            );
          })}
        </div>

        {category === "services" && (
          <div>
            <label htmlFor="subcategory" className="label">
              Type of service
            </label>
            <select
              id="subcategory"
              className="field"
              value={subcategory}
              onChange={(event) =>
                setSubcategory(event.target.value as Subcategory)
              }
            >
              {SUBCATEGORIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </fieldset>

      <fieldset className="sheet space-y-4 p-5">
        <legend className="px-1 font-display text-[17px] font-semibold">
          Listing details
        </legend>

        <div>
          <label htmlFor="title" className="label">
            Title
          </label>
          <input
            id="title"
            className="field"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={90}
            placeholder={
              direction === "wanted"
                ? "Looking for a second-hand desk lamp"
                : "Graduation photographer"
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">
              {direction === "wanted" ? "Your budget in NZD" : "Price in NZD"}
            </label>
            <input
              id="price"
              inputMode="decimal"
              className="field"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="50"
            />
          </div>
          <div>
            <label htmlFor="priceUnit" className="label">
              {direction === "wanted"
                ? "How your budget applies"
                : "How the price works"}
            </label>
            <select
              id="priceUnit"
              className="field"
              value={priceUnit}
              onChange={(event) =>
                setPriceUnit(event.target.value as PriceUnit)
              }
            >
              {PRICE_UNITS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            className="field min-h-[130px] resize-y"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={900}
            placeholder={
              direction === "wanted"
                ? "I need a desk lamp for my flat this semester. Happy to collect from anywhere near the city campus, and I can pay cash on pickup."
                : "Graduation photography for individuals and small groups. I bring my own lighting and send edited photos within three days."
            }
          />
        </div>

        <div>
          <label htmlFor="image" className="label">
            Photo (optional)
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            className="field file:mr-3 file:rounded-sheet file:border-0 file:bg-board-deep file:px-3 file:py-1.5 file:text-[13px] file:font-semibold"
          />
          {previewUrl && (
            <div className="mt-3 w-40 overflow-hidden rounded-sheet border border-board-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview of your listing photo" />
            </div>
          )}
          <p className="mt-1.5 text-[13px] text-ink-faint">
            {direction === "wanted"
              ? "Optional. A photo of something similar helps others recognise what you need."
              : "Images up to 5 MB. Without a photo, UniShare draws a poster for you."}
          </p>
        </div>
      </fieldset>

      <fieldset className="sheet space-y-4 p-5">
        <legend className="px-1 font-display text-[17px] font-semibold">
          How should students reach you?
        </legend>
        <p className="text-[14px] text-ink-soft">
          Choose at least one. Only the methods you tick will appear on your
          listing.
        </p>

        <ContactOption
          id="use-email"
          label="Email"
          checked={useEmail}
          onToggle={setUseEmail}
        >
          <input
            className="field"
            type="email"
            value={emailValue}
            onChange={(event) => setEmailValue(event.target.value)}
            placeholder="you@aucklanduni.ac.nz"
            aria-label="Contact email address"
          />
        </ContactOption>

        <ContactOption
          id="use-whatsapp"
          label="WhatsApp"
          checked={useWhatsapp}
          onToggle={setUseWhatsapp}
        >
          <input
            className="field"
            inputMode="tel"
            value={whatsappValue}
            onChange={(event) => setWhatsappValue(event.target.value)}
            placeholder="6421234567 (country code, no plus sign)"
            aria-label="WhatsApp number"
          />
        </ContactOption>

        <ContactOption
          id="use-sms"
          label="Text message"
          checked={useSms}
          onToggle={setUseSms}
        >
          <input
            className="field"
            inputMode="tel"
            value={smsValue}
            onChange={(event) => setSmsValue(event.target.value)}
            placeholder="0212345678"
            aria-label="Mobile number for text messages"
          />
        </ContactOption>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy
            ? "Saving"
            : editing
              ? "Save changes"
              : direction === "wanted"
                ? "Pin my wanted note"
                : "Pin to the wall"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-quiet"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ContactOption({
  id,
  label,
  checked,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sheet border border-board-line p-3.5">
      <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onToggle(event.target.checked)}
          className="h-4 w-4 accent-[#0A3D62]"
        />
        <span className="text-[15px] font-semibold">{label}</span>
      </label>
      {checked && <div className="mt-3">{children}</div>}
    </div>
  );
}
