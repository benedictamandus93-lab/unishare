-- ============================================================================
--  UniShare | 03_seed.sql
--  Run this last. Every name, number and address below is invented for the
--  prototype. No real personal information is used.
--
--  These rows have user_id = null, so auth.uid() = user_id is never true and
--  no logged in student can edit or delete them.
-- ============================================================================

delete from public.listings where user_id is null and direction = 'offering';

insert into public.listings
  (user_id, poster_name, category, subcategory, title, description,
   price, price_unit, email_contact, whatsapp_contact, sms_contact, created_at)
values
-- ------------------------------- BUY ---------------------------------------
(null, 'Sarah', 'buy', null,
 'Calculus Textbook',
 'Stewart Calculus, eighth edition. Good condition and barely used, with no highlighting and no missing pages. Covers the whole of the first year maths course. Happy to hand it over on campus.',
 40, 'fixed', 'sarah.demo@aucklanduni.ac.nz', null, null, now() - interval '2 days'),

(null, 'Priya', 'buy', null,
 'Desk Lamp',
 'Adjustable LED desk lamp with three brightness settings and a USB charging port. Bought last year for late night study and no longer needed. Works perfectly.',
 15, 'fixed', 'priya.demo@aucklanduni.ac.nz', '6421000101', null, now() - interval '4 days'),

(null, 'Tomas', 'buy', null,
 'Bicycle',
 'Commuter bicycle in medium frame size, recently serviced with new brake pads and tyres. Ideal for riding between the city campus and Grafton. Lock and lights included.',
 120, 'fixed', null, '6421000102', '0210000102', now() - interval '6 days'),

(null, 'Mei Ling', 'buy', null,
 'Microwave',
 'Compact 700 watt microwave, clean inside and out, perfect for a small flat kitchen. Collection only from a flat near Symonds Street.',
 30, 'fixed', 'meiling.demo@aucklanduni.ac.nz', null, '0210000103', now() - interval '8 days'),

-- ------------------------------- RENT --------------------------------------
(null, 'Daniel', 'rent', null,
 'Camera for Rent',
 'Mirrorless camera with a 24 to 70 millimetre lens, two batteries and a memory card. Suitable for graduation photography, club events and film papers. Weekend rates available.',
 25, 'day', 'daniel.demo@aucklanduni.ac.nz', '6421000104', null, now() - interval '1 day'),

(null, 'Aroha', 'rent', null,
 'Projector',
 'Full HD projector with HDMI cable and a small tripod stand. Great for group presentations, club movie nights and flat parties. Please return it charged and in the case.',
 15, 'day', null, '6421000105', '0210000105', now() - interval '3 days'),

(null, 'Jack', 'rent', null,
 'Camping Equipment',
 'Two person tent, two sleeping bags and a gas cooker, all cleaned after every hire. Everything fits into one pack, which makes it easy to take on the bus for a weekend away.',
 20, 'day', 'jack.demo@aucklanduni.ac.nz', null, null, now() - interval '5 days'),

-- ----------------------------- SERVICES ------------------------------------
(null, 'Michael', 'services', 'photography',
 'Graduation Photographer',
 'Graduation photography for individuals and groups. I shoot around the Clock Tower and Albert Park, bring my own lighting, and return a set of edited photographs within three days.',
 50, 'hour', 'michael.demo@aucklanduni.ac.nz', '6421000106', null, now() - interval '1 day'),

(null, 'Aisha', 'services', 'makeup-beauty',
 'Graduation Makeup Helper',
 'Makeup for graduation days, balls and photo shoots. I use my own kit, work with all skin tones, and can come to your flat or a room on campus. The session takes about forty five minutes.',
 35, 'fixed', null, '6421000107', '0210000107', now() - interval '2 days'),

(null, 'Ben', 'services', 'tutoring',
 'Statistics Tutor',
 'Postgraduate student offering tutoring in introductory statistics and R. I go through past exam questions, assignment feedback and the parts of the course people find hardest.',
 20, 'hour', 'ben.demo@aucklanduni.ac.nz', null, '0210000108', now() - interval '3 days'),

(null, 'Ryan', 'services', 'repairs',
 'Laptop Repair',
 'Screen replacements, battery swaps, fan cleaning and slow machine tune ups. I quote before I start any work and most jobs are finished within two days.',
 20, 'from', 'ryan.demo@aucklanduni.ac.nz', '6421000109', null, now() - interval '5 days'),

(null, 'Chloe', 'services', 'design',
 'Graphic Design',
 'Posters, club logos, social media graphics and tidy assignment layouts. Two rounds of changes are included and I hand over the editable files at the end.',
 15, 'from', null, '6421000110', null, now() - interval '7 days'),

(null, 'Sione', 'services', 'moving-help',
 'Moving Help',
 'A pair of hands and a van for flat moves at the start and end of semester. I help with lifting, stairs and loading, and I can bring a second person if you have heavy furniture.',
 20, 'hour', 'sione.demo@aucklanduni.ac.nz', null, '0210000111', now() - interval '9 days');
