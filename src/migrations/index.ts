import * as migration_20241118_121921 from './20241118_121921';
import * as migration_20241118_145140 from './20241118_145140';

export const migrations = [
  {
    up: migration_20241118_121921.up,
    down: migration_20241118_121921.down,
    name: '20241118_121921',
  },
  {
    up: migration_20241118_145140.up,
    down: migration_20241118_145140.down,
    name: '20241118_145140'
  },
];
