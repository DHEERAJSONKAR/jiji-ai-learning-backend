-- ================================================
-- Jiji Learning Platform - Extended Sample Data
-- ================================================
-- Run this after schema.sql for additional test data

-- Additional profiles
INSERT INTO profiles (id, email, name) VALUES
    ('33333333-3333-3333-3333-333333333333', 'alex@example.com', 'Alex Developer'),
    ('44444444-4444-4444-4444-444444444444', 'maria@example.com', 'Maria Engineer')
ON CONFLICT (id) DO NOTHING;

-- Additional resources
INSERT INTO resources (id, title, type, topic, file_url) VALUES
    -- JavaScript
    ('f1111111-1111-1111-1111-111111111111', 
     'JavaScript Arrays and Objects', 
     'video', 
     'javascript', 
     'https://storage.supabase.co/bucket/js-arrays.mp4'),
    
    ('f2222222-2222-2222-2222-222222222222', 
     'ES6 Arrow Functions', 
     'ppt', 
     'javascript', 
     'https://storage.supabase.co/bucket/es6-arrows.pptx'),

    -- React
    ('f3333333-3333-3333-3333-333333333333', 
     'React State Management', 
     'video', 
     'react', 
     'https://storage.supabase.co/bucket/react-state.mp4'),
    
    ('f4444444-4444-4444-4444-444444444444', 
     'Building React Components', 
     'ppt', 
     'react', 
     'https://storage.supabase.co/bucket/react-components.pptx'),

    -- Python
    ('f5555555-5555-5555-5555-555555555555', 
     'Python Lists and Dictionaries', 
     'video', 
     'python', 
     'https://storage.supabase.co/bucket/python-lists.mp4'),
    
    ('f6666666-6666-6666-6666-666666666666', 
     'Pandas DataFrame Basics', 
     'ppt', 
     'python', 
     'https://storage.supabase.co/bucket/pandas-df.pptx'),

    -- SQL
    ('f7777777-7777-7777-7777-777777777777', 
     'SQL Joins Explained', 
     'video', 
     'sql', 
     'https://storage.supabase.co/bucket/sql-joins.mp4'),
    
    ('f8888888-8888-8888-8888-888888888888', 
     'Database Normalization', 
     'ppt', 
     'sql', 
     'https://storage.supabase.co/bucket/db-normal.pptx'),

    -- Node.js
    ('f9999999-9999-9999-9999-999999999999', 
     'Express Middleware', 
     'video', 
     'nodejs', 
     'https://storage.supabase.co/bucket/express-mw.mp4'),
    
    ('faaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
     'Node.js Authentication', 
     'ppt', 
     'nodejs', 
     'https://storage.supabase.co/bucket/node-auth.pptx')
ON CONFLICT (id) DO NOTHING;

-- Additional queries for analytics
INSERT INTO queries (user_id, query_text, topic, resources_found) VALUES
    ('33333333-3333-3333-3333-333333333333', 'JavaScript arrays tutorial', 'javascript', 2),
    ('33333333-3333-3333-3333-333333333333', 'React components guide', 'react', 2),
    ('44444444-4444-4444-4444-444444444444', 'Python data science', 'python', 2),
    ('44444444-4444-4444-4444-444444444444', 'Node.js express tutorial', 'nodejs', 2),
    (NULL, 'How to use SQL joins?', 'sql', 2),
    (NULL, 'Learn React hooks', 'react', 2)
ON CONFLICT DO NOTHING;
