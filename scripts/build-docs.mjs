// Compila la documentazione in una cartella statica (HTML, CSS e un solo file JS).
// Uso: npm run docs -- --out ../ArcBase/ui/docs
import { build } from "esbuild";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFlag = process.argv.indexOf("--out");
const out = resolve(outFlag !== -1 ? process.argv[outFlag + 1] : join(root, "docs/dist"));

await mkdir(out, { recursive: true });

await build({
  entryPoints: [join(root, "docs/app.tsx")],
  outfile: join(out, "docs.js"),
  bundle: true,
  minify: true,
  jsx: "automatic",
  target: "es2020",
  legalComments: "none",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  // Il codice di next/link e next/image legge process.env: nel browser lo forniamo noi
  banner: {
    js: 'var process={env:{NODE_ENV:"production",__NEXT_IMAGE_OPTS:{deviceSizes:[640,1080],imageSizes:[16,32,48],path:"/_next/image",loader:"default",unoptimized:true,qualities:[75]}}};',
  },
  logLevel: "warning",
});

// Gli stili della libreria: CSS di login + aggiunte, come in dist/styles.css
const css = (await readFile(join(root, "src/styles/styles.css"), "utf8")) + (await readFile(join(root, "src/styles/additions.css"), "utf8"));
await writeFile(join(out, "styles.css"), css);
await copyFile(join(root, "docs/docs.css"), join(out, "docs.css"));
await copyFile(join(root, "docs/index.html"), join(out, "index.html"));

console.log(`Documentazione pronta in ${out}`);
