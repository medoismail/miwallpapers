#!/usr/bin/env node
/**
 * process-images.mjs
 *
 * Reads originals from public/images/originals/,
 * generates optimized WebP variants (480, 720, 1080 wide),
 * computes LQIP placeholders + dominant colour,
 * and writes src/data/metadata.json.
 *
 * Usage:  node scripts/process-images.mjs
 *         npm run add-images
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ORIGINALS = "public/images/originals";
const WIDTHS = [480, 720, 1080];
const PLACEHOLDER_W = 20;
const META_PATH = "src/data/metadata.json";
const IMAGE_RE = /\.(jpe?g|png|webp|tiff?)$/i;

/* ── helpers ─────────────────────────────────────────── */

function slugify(name) {
  return path.basename(name, path.extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function titleCase(slug) {
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function hexColor({ r, g, b }) {
  return "#" + [r, g, b].map((c) => Math.round(c).toString(16).padStart(2, "0")).join("");
}

/* ── main ────────────────────────────────────────────── */

async function main() {
  // Ensure directories exist
  for (const w of WIDTHS) {
    await fs.mkdir(`public/images/${w}`, { recursive: true });
  }

  // Load existing metadata to preserve user-edited fields (tags, title)
  let existing = {};
  try {
    const raw = JSON.parse(await fs.readFile(META_PATH, "utf-8"));
    for (const img of raw.images) existing[img.id] = img;
  } catch {
    /* first run */
  }

  // Discover originals
  let files;
  try {
    files = (await fs.readdir(ORIGINALS)).filter((f) => IMAGE_RE.test(f)).sort();
  } catch {
    console.log("No originals directory found. Create public/images/originals/ and add photos.");
    await fs.writeFile(META_PATH, JSON.stringify({ images: [], tags: [] }, null, 2));
    return;
  }

  if (files.length === 0) {
    console.log("No images found in public/images/originals/");
    await fs.writeFile(META_PATH, JSON.stringify({ images: [], tags: [] }, null, 2));
    return;
  }

  console.log(`Processing ${files.length} image(s)…\n`);

  const images = [];

  for (const file of files) {
    const id = slugify(file);
    const src = path.join(ORIGINALS, file);
    const meta = await sharp(src).metadata();
    const w = meta.width;
    const h = meta.height;

    process.stdout.write(`  ${file} (${w}×${h})`);

    // Resized WebP variants
    const srcSet = {};
    for (const tw of WIDTHS) {
      const outDir = `public/images/${tw}`;
      const outFile = `${id}.webp`;
      await sharp(src)
        .resize(tw, null, { withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(outDir, outFile));
      srcSet[tw] = `/images/${tw}/${outFile}`;
    }

    // LQIP placeholder (tiny base64 WebP)
    const placeholderBuf = await sharp(src)
      .resize(PLACEHOLDER_W)
      .webp({ quality: 20 })
      .toBuffer();
    const placeholder = `data:image/webp;base64,${placeholderBuf.toString("base64")}`;

    // Dominant colour
    const stats = await sharp(src).stats();
    const dominantColor = hexColor(stats.dominant);

    // Merge with existing metadata — preserve user-set tags/title
    const prev = existing[id] || {};

    images.push({
      id,
      title: prev.title || titleCase(id),
      tags: prev.tags || [],
      width: w,
      height: h,
      aspectRatio: `${w}:${h}`,
      createdAt: prev.createdAt || new Date().toISOString().split("T")[0],
      dominantColor,
      placeholder,
      original: `/images/originals/${file}`,
      srcSet,
    });

    process.stdout.write("  ✓\n");
  }

  // Collect all unique tags
  const tags = [...new Set(images.flatMap((i) => i.tags))].sort();

  await fs.writeFile(META_PATH, JSON.stringify({ images, tags }, null, 2));

  console.log(`\n✓ ${images.length} image(s) processed.`);
  console.log(`✓ Metadata written to ${META_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
