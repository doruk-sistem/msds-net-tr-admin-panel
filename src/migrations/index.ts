import * as migration_20241118_121921 from './20241118_121921';
import * as migration_20241118_145140 from './20241118_145140';
import * as migration_20241120_160814 from './20241120_160814';
import * as migration_20241126_144339 from './20241126_144339';

export const migrations = [
  {
    up: migration_20241118_121921.up,
    down: migration_20241118_121921.down,
    name: '20241118_121921',
  },
  {
    up: migration_20241118_145140.up,
    down: migration_20241118_145140.down,
    name: '20241118_145140',
  },
  {
    up: migration_20241120_160814.up,
    down: migration_20241120_160814.down,
    name: '20241120_160814',
  },
  {
    up: migration_20241126_144339.up,
    down: migration_20241126_144339.down,
    name: '20241126_144339'
  },
];
