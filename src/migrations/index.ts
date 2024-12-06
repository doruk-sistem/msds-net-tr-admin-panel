import * as migration_20241203_171816 from './20241203_171816';
import * as migration_20241203_174534 from './20241203_174534';
import * as migration_20241206_191808_new from './20241206_191808_new';

export const migrations = [
  {
    up: migration_20241203_171816.up,
    down: migration_20241203_171816.down,
    name: '20241203_171816',
  },
  {
    up: migration_20241203_174534.up,
    down: migration_20241203_174534.down,
    name: '20241203_174534',
  },
  {
    up: migration_20241206_191808_new.up,
    down: migration_20241206_191808_new.down,
    name: '20241206_191808_new'
  },
];
