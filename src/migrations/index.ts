import * as migration_20241203_171816 from './20241203_171816';
import * as migration_20241203_174534 from './20241203_174534';

export const migrations = [
  {
    up: migration_20241203_171816.up,
    down: migration_20241203_171816.down,
    name: '20241203_171816',
  },
  {
    up: migration_20241203_174534.up,
    down: migration_20241203_174534.down,
    name: '20241203_174534'
  },
];
