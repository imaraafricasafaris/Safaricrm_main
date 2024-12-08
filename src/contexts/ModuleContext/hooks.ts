```typescript
import { useContext } from 'react';
import { ModuleContext } from './context';

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
}
```