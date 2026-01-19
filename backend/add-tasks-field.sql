-- Add tasks field to assignments table
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS tasks JSONB DEFAULT '[]';

-- Add submission notes to student_assignments
ALTER TABLE student_assignments
ADD COLUMN IF NOT EXISTS submission_notes TEXT,
ADD COLUMN IF NOT EXISTS completed_tasks JSONB DEFAULT '[]';

-- Comment for documentation
COMMENT ON COLUMN assignments.tasks IS 'Array of task objects with {id, text, completed} structure';
COMMENT ON COLUMN student_assignments.completed_tasks IS 'Array of completed task IDs for this student';
