-- Announcements can show a poster or photo
ALTER TABLE announcement ADD COLUMN image_url VARCHAR(300);

-- Replace the placeholder samples from V2 with the school's real notices
DELETE FROM announcement WHERE title IN ('2027 enrolments are open', 'End-of-year concert', 'New outdoor play area');

INSERT INTO announcement (title, summary, body, category, published_at, pinned, published, image_url, created_at, updated_at) VALUES
('Registrations open: Grade R to Grade 3',
 'Grade R, 1, 2 and 3 registrations are now open. Call 060 666 2087 to register.',
 'Give your child a better future. Registrations are open for Grade R, Grade 1, Grade 2 and Grade 3 at 7009 Kingdom Street, Ivory Park. Call 060 666 2087 or 071 646 3498, or send us a message through the contact page.',
 'ANNOUNCEMENT', '2026-11-24', TRUE, TRUE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ivory Park Family Fun Day 2026',
 'Saturday 5 December 2026 at Mhlangu Sports Ground, Ema 7. Tickets from R70.',
 'Veli Child Academy and SHEBBA Media present the 4th annual Ivory Park Family Fun Day on Saturday 5 December 2026 at Mhlangu Sports Ground, Ema 7 (Bidebaggeme Rd, Ivory Park). Tickets: kids R80, adults R70, family combo of 2 adults and 1 child R170, 2 adults and 2 kids R200. Includes an indigenous games tournament (registration R50). Pre-order on +27 60 666 2087 and bring your camp chairs and umbrellas.',
 'EVENT', '2026-11-24', FALSE, TRUE, '/images/family-fun-day-2026.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bins of Hope donation drive',
 'Help us collect school shoes, uniforms, clothing and sanitary pads for children in need.',
 'At the Ivory Park Family Fun Day we are collecting donations of school shoes, sanitary pads, clothing, shoes and school uniforms. To donate, call 060 666 2087.',
 'NEWS', '2026-11-24', FALSE, TRUE, '/images/bins-of-hope.jpg', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('New: robotics and computer classes',
 'Robotics, computer literacy and computer numeracy are now part of learning at Veli.',
 'Our learners can now take robotics, computer literacy and computer numeracy classes, building the digital skills they need for the future. Contact us to find out more.',
 'NEWS', '2026-11-24', FALSE, TRUE, NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
