-- Multi-tenancy schema for GovernaCann

CREATE TABLE associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
    wallet_address TEXT,
    mission TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id UUID REFERENCES associations(id),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    wallet_address TEXT,
    status TEXT DEFAULT 'pending', -- pending, active, suspended
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id),
    doctor_name TEXT NOT NULL,
    doctor_crm TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    document_url TEXT,
    is_valid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cultivation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id UUID REFERENCES associations(id),
    batch_id TEXT NOT NULL,
    phase TEXT NOT NULL, -- germination, vegetative, flowering, harvest, drying
    temperature DECIMAL,
    humidity DECIMAL,
    ph DECIMAL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    association_id UUID REFERENCES associations(id),
    type TEXT NOT NULL, -- contribution, payment, reinvestment
    amount DECIMAL NOT NULL,
    partner_id TEXT,
    tx_hash TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
