import { supabase } from '../supabase';
import { Dependency, DependencyValidation } from '../../types/dependencies';

export async function getDependencies(moduleId: string): Promise<Dependency[]> {
  const { data, error } = await supabase
    .from('module_dependencies')
    .select('*')
    .eq('source_module', moduleId);

  if (error) throw error;
  return data;
}

export async function validateDependencies(moduleId: string): Promise<DependencyValidation> {
  const { data, error } = await supabase
    .rpc('validate_module_dependencies', { module_id: moduleId });

  if (error) throw error;

  return {
    isValid: !data.missing_dependencies?.length && !data.circular_dependencies?.length,
    missingDependencies: data.missing_dependencies || [],
    circularDependencies: data.circular_dependencies || [],
    criticalDependencies: data.critical_dependencies || []
  };
}

export async function addDependency(dependency: Omit<Dependency, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('module_dependencies')
    .insert([dependency])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeDependency(sourceModule: string, targetModule: string) {
  const { error } = await supabase
    .from('module_dependencies')
    .delete()
    .match({ source_module: sourceModule, target_module: targetModule });

  if (error) throw error;
}

export async function getDependencyGraph(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase
    .from('module_dependencies')
    .select('source_module, target_module');

  if (error) throw error;

  const graph: Record<string, string[]> = {};
  data.forEach(({ source_module, target_module }) => {
    if (!graph[source_module]) graph[source_module] = [];
    graph[source_module].push(target_module);
  });

  return graph;
}