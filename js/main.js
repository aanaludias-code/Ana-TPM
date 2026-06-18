/* main.js — bootstrap. Registers all screens, loads save, renders. */

import { go } from './router.js';
import { load, hasSave } from './state.js';

// Register screens (import for side-effects)
import './screens/title.js';
import './screens/protagonist.js';
import './screens/map.js';
import './screens/journal.js';
import './screens/chapter1.js';
import './screens/chapter2.js';
import './screens/chapter3.js';
import './screens/chapter4.js';
import './screens/chapter5.js';
import './screens/ending.js';

// Optional genetics self-test via ?selftest
if (new URLSearchParams(location.search).has('selftest')) {
  import('./genetics/selftest.js').then(m => m.run());
}

// Boot
load();
go('title');
