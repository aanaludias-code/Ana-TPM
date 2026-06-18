/* run-selftest.js — Node entry point for the genetics self-test.
   Usage: npm test  (or: node js/genetics/run-selftest.js) */

import { run } from './selftest.js';

const { fail } = run();
process.exitCode = fail > 0 ? 1 : 0;
