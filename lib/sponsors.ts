/**
 * ---------------------------------------------------------------------------
 *  CORNER ADVERTISEMENT
 * ---------------------------------------------------------------------------
 *  This is the only file you need to edit to change the advertisement.
 *
 *  To swap in a different advertiser:
 *    1. Put the new image in  public/ads/
 *    2. Change the four fields below
 *
 *  To take the advertisement down entirely:
 *    Set  enabled: false
 *
 *  To run more than one advertisement, add further objects to the array.
 *  One is chosen at random on each page load.
 * ---------------------------------------------------------------------------
 */

export interface Sponsor {
  /** Shown to screen readers and used as the image alt text. */
  name: string;
  /** Path inside the public folder, for example /ads/your-file.png */
  image: string;
  /** Where clicking the advertisement takes the student. */
  href: string;
  /** One short line under the image. Keep it under about 40 characters. */
  tagline: string;
}

export const ADS_ENABLED = true;

/** Small text above the image, so students can tell an advertisement apart from a listing. */
export const ADS_LABEL = "Sponsored";

export const SPONSORS: Sponsor[] = [
  {
    name: "See The Light Consulting",
    image: "/ads/see-the-light.png",
    href: "https://www.seethelight.co.nz/steven-briggs-profile/",
    tagline: "Career and business consulting",
  },
];
