-- Add staff module to module_states if not exists
INSERT INTO module_states (module_id, status)
VALUES ('staff-management', 'active')
ON CONFLICT (module_id) DO UPDATE 
SET status = 'active';