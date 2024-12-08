-- Ensure lead-management module is active
INSERT INTO module_states (module_id, status)
VALUES ('lead-management', 'active')
ON CONFLICT (module_id) 
DO UPDATE SET status = 'active'
WHERE module_states.module_id = 'lead-management';