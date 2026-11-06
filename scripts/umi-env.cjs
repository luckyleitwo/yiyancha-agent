const { spawnSync } = require('node:child_process');
const path = require('node:path');

const [environment, command] = process.argv.slice(2);
if (
  !['development', 'test', 'production'].includes(environment) ||
  !['dev', 'build'].includes(command)
) {
  console.error(
    '用法：node scripts/umi-env.cjs <development|test|production> <dev|build>',
  );
  process.exit(1);
}
const max = path.join(
  path.dirname(require.resolve('@umijs/max/package.json')),
  'bin/max.js',
);
const result = spawnSync(process.execPath, [max, command], {
  stdio: 'inherit',
  env: { ...process.env, UMI_APP_ENV: environment },
});
if (result.error) throw result.error;
process.exit(result.status ?? 1);
