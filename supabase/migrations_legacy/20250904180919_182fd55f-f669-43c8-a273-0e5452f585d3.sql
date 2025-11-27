-- Create tables for Migration & Sync functionality

-- Table for storing field mappings between Filevine and NuLedger
CREATE TABLE public.field_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filevine_field TEXT NOT NULL,
  nuledger_field TEXT NOT NULL,
  mapping_status TEXT NOT NULL DEFAULT 'unmapped' CHECK (mapping_status IN ('mapped', 'manual_required', 'unmapped')),
  data_type TEXT NOT NULL DEFAULT 'text' CHECK (data_type IN ('text', 'number', 'date', 'boolean', 'json')),
  is_required BOOLEAN NOT NULL DEFAULT false,
  transformation_rule TEXT,
  preset_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for migration job logs
CREATE TABLE public.migration_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL CHECK (job_type IN ('initial_import', 'ongoing_sync', 'manual_sync')),
  data_categories TEXT[] NOT NULL DEFAULT '{}',
  date_range_start DATE,
  date_range_end DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed', 'partial')),
  records_total INTEGER DEFAULT 0,
  records_success INTEGER DEFAULT 0,
  records_skipped INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  error_logs JSONB DEFAULT '[]',
  skip_reasons JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for storing sync configuration
CREATE TABLE public.sync_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auto_sync_enabled BOOLEAN NOT NULL DEFAULT false,
  sync_frequency TEXT NOT NULL DEFAULT 'daily' CHECK (sync_frequency IN ('hourly', 'daily', 'weekly')),
  filevine_org_id TEXT,
  filevine_user_id TEXT,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for detailed migration records
CREATE TABLE public.migration_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  migration_job_id UUID NOT NULL REFERENCES public.migration_jobs(id) ON DELETE CASCADE,
  filevine_id TEXT NOT NULL,
  nuledger_id TEXT,
  record_type TEXT NOT NULL CHECK (record_type IN ('case', 'settlement', 'client', 'invoice', 'contact')),
  source_data JSONB NOT NULL,
  transformed_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'skipped')),
  error_message TEXT,
  skip_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_field_mappings_preset ON public.field_mappings(preset_name);
CREATE INDEX idx_migration_jobs_status ON public.migration_jobs(status);
CREATE INDEX idx_migration_jobs_created ON public.migration_jobs(created_at);
CREATE INDEX idx_migration_records_job ON public.migration_records(migration_job_id);
CREATE INDEX idx_migration_records_type ON public.migration_records(record_type);
CREATE INDEX idx_migration_records_status ON public.migration_records(status);

-- Enable Row Level Security
ALTER TABLE public.field_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.migration_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (for now, allow all operations - customize based on auth requirements)
CREATE POLICY "Allow all operations on field_mappings" ON public.field_mappings FOR ALL USING (true);
CREATE POLICY "Allow all operations on migration_jobs" ON public.migration_jobs FOR ALL USING (true);
CREATE POLICY "Allow all operations on sync_config" ON public.sync_config FOR ALL USING (true);
CREATE POLICY "Allow all operations on migration_records" ON public.migration_records FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_field_mappings_updated_at
  BEFORE UPDATE ON public.field_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sync_config_updated_at
  BEFORE UPDATE ON public.sync_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_migration_records_updated_at
  BEFORE UPDATE ON public.migration_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default field mappings
INSERT INTO public.field_mappings (filevine_field, nuledger_field, mapping_status, data_type, is_required) VALUES
('SettlementAmount', 'Total Settlement', 'mapped', 'number', true),
('AttorneyFees', 'Fee Allocation', 'manual_required', 'number', true),
('LienStatus', 'Lien', 'mapped', 'text', false),
('CaseNumber', 'Case Number', 'mapped', 'text', true),
('ClientName', 'Client Name', 'mapped', 'text', true),
('DateOfLoss', 'Date of Loss', 'mapped', 'date', false),
('DateSettled', 'Date Settled', 'mapped', 'date', false),
('CaseManager', 'Case Manager', 'mapped', 'text', false),
('PolicyLimits', 'Policy Limits', 'manual_required', 'number', false),
('NegotiatedBy', 'Negotiated By', 'mapped', 'text', false);

-- Insert default sync configuration
INSERT INTO public.sync_config (auto_sync_enabled, sync_frequency) VALUES (false, 'daily');