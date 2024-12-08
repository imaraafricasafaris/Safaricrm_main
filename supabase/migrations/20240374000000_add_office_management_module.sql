-- Add office management module to module_states
INSERT INTO module_states (module_id, status)
VALUES ('office-management', 'active')
ON CONFLICT (module_id) DO UPDATE 
SET status = 'active',
    updated_at = NOW();