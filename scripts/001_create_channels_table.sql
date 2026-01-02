-- Create channels table with approval status
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  link TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  country TEXT NOT NULL,
  country_flag TEXT NOT NULL,
  verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_by_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read approved channels
CREATE POLICY "Anyone can view approved channels" 
  ON channels FOR SELECT 
  USING (status = 'approved');

-- Policy: Anyone can insert new channels (they start as pending)
CREATE POLICY "Anyone can submit channels" 
  ON channels FOR INSERT 
  WITH CHECK (status = 'pending');

-- Create index for faster queries
CREATE INDEX idx_channels_status ON channels(status);
CREATE INDEX idx_channels_category ON channels(category);
CREATE INDEX idx_channels_country ON channels(country);
