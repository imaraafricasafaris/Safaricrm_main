-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure module_states table exists and is clean
TRUNCATE TABLE module_states CASCADE;

-- Insert all modules with their default states
INSERT INTO module_states (module_id, status, settings) VALUES
  -- Core Modules (Always Active)
  ('dashboard', 'active', '{"default_view": "grid", "refresh_interval": 300}'::jsonb),
  ('settings', 'active', '{}'::jsonb),
  ('notifications', 'active', '{"email_notifications": true, "push_notifications": true}'::jsonb),
  ('leads', 'active', '{"auto_assignment": true, "follow_up_days": 3}'::jsonb),
  ('modules', 'active', '{}'::jsonb),

  -- CRM Modules
  ('client-management', 'active', '{"enable_documents": true, "enable_communications": true}'::jsonb),
  ('task-management', 'active', '{"enable_reminders": true, "default_priority": "medium"}'::jsonb),
  ('document-management', 'active', '{"storage_provider": "local", "max_file_size": 10485760}'::jsonb),

  -- Financial Modules
  ('invoicing', 'active', '{"currency": "USD", "tax_rate": 0.0, "payment_terms": 30}'::jsonb),
  ('payments', 'inactive', '{"providers": ["stripe", "paypal"], "test_mode": true}'::jsonb),

  -- Operational Modules
  ('itinerary-builder', 'active', '{"default_currency": "USD", "include_tax": true}'::jsonb),
  ('safari-packages', 'inactive', '{"enable_seasonal_pricing": true, "default_duration": 7}'::jsonb),
  ('vehicle-fleet', 'inactive', '{"enable_maintenance_tracking": true, "booking_buffer_hours": 24}'::jsonb),
  ('guide-management', 'inactive', '{"certification_tracking": true, "availability_calendar": true}'::jsonb),

  -- Advanced Features
  ('advanced-reporting', 'active', '{"enable_exports": true, "scheduled_reports": true}'::jsonb),
  ('workflow-automation', 'inactive', '{"max_active_workflows": 10, "enable_conditions": true}'::jsonb),
  ('email-automation', 'inactive', '{"max_daily_emails": 1000, "require_unsubscribe_link": true}'::jsonb),

  -- System Modules
  ('staff-management', 'active', '{"enable_time_tracking": true, "require_2fa": false}'::jsonb),
  ('office-management', 'active', '{"multi_currency": true, "enable_resource_sharing": true}'::jsonb),
  ('api', 'active', '{"rate_limit": 1000, "require_authentication": true}'::jsonb)
ON CONFLICT (module_id) DO UPDATE 
SET status = CASE
  -- Ensure core modules stay active
  WHEN module_states.module_id IN ('dashboard', 'settings', 'notifications', 'leads', 'modules') THEN 'active'
  ELSE EXCLUDED.status
END,
settings = EXCLUDED.settings;

-- Create function to validate module activation
CREATE OR REPLACE FUNCTION validate_module_activation()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent deactivation of core modules
  IF OLD.module_id IN ('dashboard', 'settings', 'notifications', 'leads', 'modules') 
     AND NEW.status = 'inactive' THEN
    RAISE EXCEPTION 'Cannot deactivate core module %', OLD.module_id;
  END IF;

  -- Log module state change
  INSERT INTO module_logs (
    module_id,
    user_id,
    action,
    details
  ) VALUES (
    NEW.module_id,
    auth.uid(),
    CASE
      WHEN NEW.status = 'active' THEN 'activate'
      ELSE 'deactivate'
    END,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'old_settings', OLD.settings,
      'new_settings', NEW.settings
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace trigger for module activation validation
DROP TRIGGER IF EXISTS validate_module_activation_trigger ON module_states;
CREATE TRIGGER validate_module_activation_trigger
  BEFORE UPDATE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION validate_module_activation();

-- Grant appropriate permissions
GRANT ALL ON TABLE module_states TO authenticated;
GRANT ALL ON TABLE module_logs TO authenticated;