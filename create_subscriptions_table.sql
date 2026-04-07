-- Create subscriptions table
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
    
    -- Status
    status TEXT DEFAULT 'pending' -- pending, completed, failed
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert (for the subscription form)
CREATE POLICY "Allow public insert" ON subscriptions FOR INSERT WITH CHECK (true);

-- Allow authenticated users to select (for admin dashboard)
CREATE POLICY "Allow authenticated select" ON subscriptions FOR SELECT TO authenticated USING (true);
