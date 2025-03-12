import * as migration_20241219_141241_inital from './20241219_141241_inital';
import * as migration_20250106_110124_v0_0_1_beta_9 from './20250106_110124_v0_0_1_beta_9';
import * as migration_20250123_165154_v0_0_1_beta_10 from './20250123_165154_v0_0_1_beta_10';
import * as migration_20250204_102827_v0_0_1_beta_12 from './20250204_102827_v0_0_1_beta_12';
import * as migration_20250312_103755 from './20250312_103755';

export const migrations = [
  {
    up: migration_20241219_141241_inital.up,
    down: migration_20241219_141241_inital.down,
    name: '20241219_141241_inital',
  },
  {
    up: migration_20250106_110124_v0_0_1_beta_9.up,
    down: migration_20250106_110124_v0_0_1_beta_9.down,
    name: '20250106_110124_v0_0_1_beta_9',
  },
  {
    up: migration_20250123_165154_v0_0_1_beta_10.up,
    down: migration_20250123_165154_v0_0_1_beta_10.down,
    name: '20250123_165154_v0_0_1_beta_10',
  },
  {
    up: migration_20250204_102827_v0_0_1_beta_12.up,
    down: migration_20250204_102827_v0_0_1_beta_12.down,
    name: '20250204_102827_v0_0_1_beta_12',
  },
  {
    up: migration_20250312_103755.up,
    down: migration_20250312_103755.down,
    name: '20250312_103755'
  },
];
