// Usage : node scripts/illustrations/generate.mjs <jobs.json> <outDir>
// jobs.json : [{ "id": "A1", "model": "black-forest-labs/flux-schnell", "input": { ... } }]
// Aucune dépendance. Lit REPLICATE_API_TOKEN. Ne relance pas un job dont le fichier existe déjà.
import { access, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const [, , jobsPath, outDir] = process.argv;
const token = process.env.REPLICATE_API_TOKEN;
if (!token || !jobsPath || !outDir) {
  console.error("usage/token manquant");
  process.exit(1);
}
const jobs = JSON.parse(await readFile(jobsPath, "utf8"));

async function run(job) {
  const ext = job.ext ?? job.input.output_format ?? "webp";
  const file = join(outDir, `${job.id}.${ext}`);
  try {
    await access(file);
    console.log(`skip ${job.id}`);
    return;
  } catch {}
  const res = await fetch(
    `https://api.replicate.com/v1/models/${job.model}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait=60",
      },
      body: JSON.stringify({ input: job.input }),
    },
  );
  let p = await res.json();
  if (res.status === 429) {
    console.log(`429 ${job.id}, attente 12 s`);
    await new Promise((r) => setTimeout(r, 12000));
    return run(job);
  }
  if (!p.urls) {
    console.error(job.id, res.status, JSON.stringify(p));
    return;
  }
  while (p.status && !["succeeded", "failed", "canceled"].includes(p.status)) {
    await new Promise((r) => setTimeout(r, 2000));
    p = await (
      await fetch(p.urls.get, { headers: { Authorization: `Bearer ${token}` } })
    ).json();
  }
  if (p.status !== "succeeded") {
    console.error(job.id, p.status, p.error ?? p.detail);
    return;
  }
  const url = Array.isArray(p.output) ? p.output[0] : p.output;
  const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
  await writeFile(file, buf);
  console.log(`ok ${job.id} -> ${file} (${p.metrics?.predict_time ?? "?"} s)`);
}
for (const job of jobs) await run(job);
