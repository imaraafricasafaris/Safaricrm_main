import { supabase } from '../supabase';
import type { Task } from '../database/types';

export async function getTasks(filters?: {
  assigned_to?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date_range?: { start: string; end: string };
}) {
  let query = supabase.from('tasks').select('*');

  if (filters?.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.priority) {
    query = query.eq('priority', filters.priority);
  }

  if (filters?.due_date_range) {
    query = query.gte('due_date', filters.due_date_range.start)
                .lte('due_date', filters.due_date_range.end);
  }

  const { data, error } = await query.order('due_date', { ascending: true });
  if (error) throw error;
  return data as Task[];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function updateTaskStatus(taskId: string, status: Task['status']) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}

export async function assignTask(taskId: string, userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ 
      assigned_to: userId,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data as Task;
}