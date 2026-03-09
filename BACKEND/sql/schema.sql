-- ================================================
-- Jiji Learning Resource Platform - Database Schema
-- ================================================
-- Run this SQL in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================================
-- 1. PROFILES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 2. RESOURCES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('video', 'ppt')),
    topic VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. QUERIES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    query_text TEXT NOT NULL,
    topic VARCHAR(255),
    resources_found INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- INDEXES (Best Practices)
-- ================================================

-- Profiles: Index on email for auth lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Resources: Indexes for filtering and searching
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_topic ON resources(topic);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

-- Full-text search on title for keyword matching
CREATE INDEX IF NOT EXISTS idx_resources_title_fts ON resources 
    USING GIN (to_tsvector('english', title));

-- Queries: Indexes for analytics and user history
CREATE INDEX IF NOT EXISTS idx_queries_user_id ON queries(user_id);
CREATE INDEX IF NOT EXISTS idx_queries_created_at ON queries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_queries_topic ON queries(topic);

-- ================================================
-- ROW LEVEL SECURITY (RLS)
-- ================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Service role has full access
CREATE POLICY "Service role full access profiles" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- RESOURCES POLICIES
-- Anyone can read resources (public learning content)
CREATE POLICY "Resources are public" ON resources
    FOR SELECT USING (true);

-- Only service role can insert/update/delete resources
CREATE POLICY "Service role manages resources" ON resources
    FOR ALL USING (auth.role() = 'service_role');

-- QUERIES POLICIES
-- Users can view their own query history
CREATE POLICY "Users can view own queries" ON queries
    FOR SELECT USING (auth.uid() = user_id);

-- Anyone can insert queries (for anonymous users too)
CREATE POLICY "Anyone can log queries" ON queries
    FOR INSERT WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Service role full access queries" ON queries
    FOR ALL USING (auth.role() = 'service_role');

-- ================================================
-- TRIGGERS
-- ================================================

-- Auto-update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ================================================
-- EXAMPLE INSERT DATA
-- ================================================

-- Sample profiles
INSERT INTO profiles (id, email, name) VALUES
    ('11111111-1111-1111-1111-111111111111', 'student@example.com', 'John Student'),
    ('22222222-2222-2222-2222-222222222222', 'teacher@example.com', 'Jane Teacher')
ON CONFLICT (id) DO NOTHING;

-- Sample resources
INSERT INTO resources (id, title, type, topic, file_url) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
     'Introduction to JavaScript', 
     'video', 
     'javascript', 
     'https://storage.supabase.co/bucket/js-intro.mp4'),
    
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
     'React Hooks Explained', 
     'ppt', 
     'react', 
     'https://storage.supabase.co/bucket/react-hooks.pptx'),
    
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 
     'Python for Data Science', 
     'video', 
     'python', 
     'https://storage.supabase.co/bucket/python-ds.mp4'),
    
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 
     'SQL Fundamentals', 
     'ppt', 
     'sql', 
     'https://storage.supabase.co/bucket/sql-basics.pptx'),
    
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 
     'Node.js REST APIs', 
     'video', 
     'nodejs', 
     'https://storage.supabase.co/bucket/node-api.mp4')
ON CONFLICT (id) DO NOTHING;

-- Sample queries
INSERT INTO queries (user_id, query_text, topic, resources_found) VALUES
    ('11111111-1111-1111-1111-111111111111', 'How do I learn JavaScript?', 'javascript', 1),
    ('11111111-1111-1111-1111-111111111111', 'What are React hooks?', 'react', 1),
    ('22222222-2222-2222-2222-222222222222', 'Python basics', 'python', 1),
    (NULL, 'SQL joins tutorial', 'sql', 1)
ON CONFLICT DO NOTHING;
