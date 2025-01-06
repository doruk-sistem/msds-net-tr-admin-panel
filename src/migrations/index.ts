import * as migration_20250106_113244_initial from './20250106_113244_initial';

export const migrations = [
  {
    up: migration_20250106_113244_initial.up,
    down: migration_20250106_113244_initial.down,
    name: '20250106_113244_initial'
  },
];
