// strapi/dev.ts
import path from 'path';
import { spawn } from 'child_process';
import openSshTunnel from './tunnel';

async function main(): Promise<void> {
  // 1) Open (or skip) the SSH tunnel
  await openSshTunnel();

  // Collect extra CLI arguments (e.g., --debug)
  const extraArgs = process.argv.slice(2);
  console.log('Launching Strapi from:', __dirname,);
  // 2) Hand off to Strapi via Yarn, forwarding extra args
  const child = spawn('yarn', ['develop', ...extraArgs], {
    cwd: path.resolve(__dirname),
    stdio: 'inherit',
    shell: true, // ensures the command is correctly resolved in all environments
    env: { ...process.env }, // Pass current environment variables to the child process
  });

  child.on('exit', (code: number | null) => {
    process.exit(code ?? 0);
  });

  child.on('error', (err: Error) => {
    console.error('⚠️  Failed to launch Strapi CLI:', err);
    process.exit(1);
  });
}

main().catch((err: Error) => {
  console.error('❌  SSH-tunnel bootstrap failed:', err);
  process.exit(1);
});