import * as migration_20241219_141241_inital from './20241219_141241_inital';

export const migrations = [
  {
    up: migration_20241219_141241_inital.up,
    down: migration_20241219_141241_inital.down,
    name: '20241219_141241_inital'
  },
];
