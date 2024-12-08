```typescript
import { createContext } from 'react';
import { ModuleContextType } from './types';

export const ModuleContext = createContext<ModuleContextType | undefined>(undefined);
```