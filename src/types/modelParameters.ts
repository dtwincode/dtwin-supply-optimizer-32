
import { ModelConfig } from './models/commonTypes';
import { basicModels } from './models/basicModels';
import { advancedModels } from './models/advancedModels';
import { seasonalModels } from './models/seasonalModels';

export type { ModelParameter, ModelConfig } from './models/commonTypes';

export const defaultModelConfigs: ModelConfig[] = [
  ...basicModels,
  ...advancedModels,
  ...seasonalModels
];
