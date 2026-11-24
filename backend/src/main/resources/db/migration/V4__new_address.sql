-- The school moved to 12498 Khoza Street, Ivory Park
UPDATE announcement
SET body = REPLACE(body, '7009 Kingdom Street', '12498 Khoza Street')
WHERE body LIKE '%7009 Kingdom Street%';
