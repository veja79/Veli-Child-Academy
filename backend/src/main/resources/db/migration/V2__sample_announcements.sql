-- Sample content so the site is not empty on first run. Delete from the admin portal when real posts exist.
INSERT INTO announcement (title, summary, body, category, published_at, pinned, published, created_at, updated_at) VALUES
('2027 enrolments are open',
 'Applications for all age groups are now open. Space is limited.',
 'Applications for 2027 are now open for all age groups. Contact the office or use the contact form to request an application pack and book a visit.',
 'ANNOUNCEMENT', '2026-11-20', TRUE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('End-of-year concert',
 'Join us for our annual concert and Grade R graduation.',
 'Families are invited to our end-of-year concert and Grade R graduation. Date and venue details will be sent home with each child.',
 'EVENT', '2026-11-15', FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('New outdoor play area',
 'Our learners are enjoying the new jungle gym and sandpit.',
 'Thanks to the support of our parents, the new outdoor play area is complete. Children now have more space to climb, dig and explore.',
 'NEWS', '2026-10-30', FALSE, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
