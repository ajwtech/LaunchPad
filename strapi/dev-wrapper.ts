#!/usr/bin/env ts-node

import { config as loadEnv } from "dotenv";
import { spawnSync } from "child_process";
import { resolve, dirname } from "path";
import { existsSync } from "fs";
import openSshTunnel from "./tunnel";

/**
 * Recursively look up from cwd for an env file, returning its full path.
 */
function findEnvFile(filename: string): string | null {
  let dir = process.cwd();
  const root = resolve(dir, "/");
  while (true) {
    const candidate = resolve(dir, filename);
    if (existsSync(candidate)) {
      return candidate;
    }
    const parent = dirname(dir);
    if (parent === dir || parent === root) break;
    dir = parent;
  }
  return null;
}

async function main(): Promise<void> {
  // 1) Determine which .env file to load (CLI arg or default)
  const envArg = process.argv[2];
  const envFilename = envArg || ".env.development";

  // 2) Find the file up the directory tree
  const envPath = findEnvFile(envFilename);
  if (!envPath) {
    console.warn(`⚠️  Env file '${envFilename}' not found; skipping dotenv`);
  } else {
    console.info(`🔍  Loading env from ${envPath}`);
    loadEnv({ path: envPath });
  }

  // 3) Bootstrap SSH tunnel if needed
  try {
    await openSshTunnel();
  } catch (err: any) {
    console.error(`❌  SSH-tunnel bootstrap failed: ${err.message || err}`);
    process.exit(1);
  }

  // 4) Select ESC environment (from env or fallback)
  const escEnv = process.env.ESC || "org/marketforge/project";

  // 5) Assemble command for Strapi via Yarn
  const extraArgs = process.argv.slice(2)
    .filter(arg => !arg.endsWith(".env.development") && !arg.endsWith(".env.staging"));
  const devCmd = ["yarn strapi develop", ...extraArgs].join(" ");

  // 6) Build full 'esc env run' invocation
  const escArgs = [
    "env", "run", escEnv,
    "--",
    "bash", "-lc",
    devCmd
  ];

  // 7) Log the exact command for debugging
  console.info(
    `🚀  Running: esc ${escArgs
      .map(a => (a.includes(' ') ? `"${a}"` : a))
      .join(' ')}`
  );

  // 8) Spawn ESC process, inheriting our merged env
  const result = spawnSync("esc", escArgs, {
    stdio: "inherit",
    env: process.env,
  });

  process.exit(result.status ?? 1);
}

main();
