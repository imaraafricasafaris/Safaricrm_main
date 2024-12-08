export type DependencyType = 'required' | 'optional' | 'recommended';
export type DependencyPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface Dependency {
  id: string;
  source_module: string;
  target_module: string;
  type: DependencyType;
  priority: DependencyPriority;
  description: string;
  api_endpoints?: string[];
  shared_resources?: string[];
  failure_impact: number; // 1-5 scale
  mttr_estimate: number; // Mean Time To Recovery in minutes
  created_at: string;
  updated_at: string;
}

export interface DependencyValidation {
  isValid: boolean;
  missingDependencies: string[];
  circularDependencies: string[][];
  criticalDependencies: Dependency[];
}