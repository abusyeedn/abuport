import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { optimize } from 'svgo';

const DIRECTORIES_TO_SCAN = ['./public', './src'];
const EXCLUDE_DIRS = ['node_modules', '.git', 'dist', 'storybook-static'];

// Allowed extensions
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg'];

// Track stats
let totalFiles = 0;
let optimizedFilesCount = 0;
let skippedFilesCount = 0;
let totalOriginalBytes = 0;
let totalOptimizedBytes = 0;

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Recursively find all image files
function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (EXCLUDE_DIRS.includes(file)) {
        continue;
      }
      getFilesRecursively(filePath, fileList);
    } else {
      const ext = path.extname(filePath).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

// Optimize a single image file
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const originalSize = fs.statSync(filePath).size;
  totalOriginalBytes += originalSize;
  totalFiles++;

  const tempPath = filePath + '.opt.tmp';
  let success = false;

  try {
    if (ext === '.svg') {
      const svgContent = fs.readFileSync(filePath, 'utf8');
      const result = optimize(svgContent, {
        path: filePath,
        multipass: true,
      });

      if (result.data) {
        fs.writeFileSync(tempPath, result.data, 'utf8');
        success = true;
      } else {
        console.warn(`[WARN] SVGO failed to optimize ${filePath}`);
      }
    } else if (ext === '.png') {
      await sharp(filePath)
        .png({ palette: true, quality: 85 })
        .toFile(tempPath);
      success = true;
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .jpeg({ quality: 80, progressive: true })
        .toFile(tempPath);
      success = true;
    }
  } catch (err) {
    console.error(`[ERROR] Failed to process ${filePath}: ${err.message}`);
    success = false;
  }

  if (success && fs.existsSync(tempPath)) {
    const optimizedSize = fs.statSync(tempPath).size;
    
    // Only replace if the optimized size is strictly smaller
    if (optimizedSize < originalSize) {
      fs.renameSync(tempPath, filePath);
      totalOptimizedBytes += optimizedSize;
      optimizedFilesCount++;
      const saved = originalSize - optimizedSize;
      const pct = ((saved / originalSize) * 100).toFixed(1);
      console.log(`[OPTIMIZED] ${filePath}: ${formatBytes(originalSize)} -> ${formatBytes(optimizedSize)} (-${pct}%, saved ${formatBytes(saved)})`);
    } else {
      // Clean up temp file, keep original
      fs.unlinkSync(tempPath);
      totalOptimizedBytes += originalSize;
      skippedFilesCount++;
    }
  } else {
    // If optimization didn't succeed or didn't produce temp file, keep original
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    totalOptimizedBytes += originalSize;
    skippedFilesCount++;
  }
}

async function run() {
  console.log('Finding images in:', DIRECTORIES_TO_SCAN.join(', '));
  let allImages = [];
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (fs.existsSync(dir)) {
      getFilesRecursively(dir, allImages);
    }
  }

  console.log(`Found ${allImages.length} images. Starting optimization...\n`);

  for (let i = 0; i < allImages.length; i++) {
    const imgPath = allImages[i];
    await optimizeImage(imgPath);
  }

  console.log('\n=========================================');
  console.log('            OPTIMIZATION SUMMARY         ');
  console.log('=========================================');
  console.log(`Total files scanned:   ${totalFiles}`);
  console.log(`Files optimized:       ${optimizedFilesCount}`);
  console.log(`Files skipped/no change:${skippedFilesCount}`);
  console.log(`Original size:         ${formatBytes(totalOriginalBytes)}`);
  console.log(`Optimized size:        ${formatBytes(totalOptimizedBytes)}`);
  
  const totalSaved = totalOriginalBytes - totalOptimizedBytes;
  const totalSavedPct = ((totalSaved / totalOriginalBytes) * 100).toFixed(1);
  console.log(`Total savings:         ${formatBytes(totalSaved)} (-${totalSavedPct}%)`);
  console.log('=========================================');
}

run().catch(err => {
  console.error('Fatal error running optimization:', err);
  process.exit(1);
});
