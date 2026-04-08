-- Create subscriptions table if it doesn't exist
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Customer Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile TEXT NOT NULL,
    
    -- Shipping Address
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pin_code TEXT NOT NULL,
    
    -- Status and soft-delete
    status TEXT DEFAULT 'pending', -- pending, active, completed, failed
    is_deleted BOOLEAN DEFAULT false,
    products TEXT[] -- Array of products (Little Whiz, EurekaFM)
);

-- Safely add columns if table exists but columns don't
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='is_deleted') THEN
        ALTER TABLE subscriptions ADD COLUMN is_deleted BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscriptions' AND column_name='products') THEN
        ALTER TABLE subscriptions ADD COLUMN products TEXT[];
    END IF;
END $$;

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Safely recreate policies
DROP POLICY IF EXISTS "Allow public insert" ON subscriptions;
CREATE POLICY "Allow public insert" ON subscriptions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated select" ON subscriptions;
CREATE POLICY "Allow authenticated select" ON subscriptions FOR SELECT TO authenticated USING (true);

-- Add update policy for admin to toggle status/delete
DROP POLICY IF EXISTS "Allow authenticated update" ON subscriptions;
CREATE POLICY "Allow authenticated update" ON subscriptions FOR UPDATE TO authenticated USING (true);

-- Add delete policy for admin to permanent delete from bin
DROP POLICY IF EXISTS "Allow authenticated delete" ON subscriptions;
CREATE POLICY "Allow authenticated delete" ON subscriptions FOR DELETE TO authenticated USING (true);
