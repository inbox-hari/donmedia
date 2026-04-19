// No external dependencies besides @supabase/supabase-js
import { createClient } from '@supabase/supabase-js';

/**
 * CONFIGURATION
 * 
 * Run this script using:
 * node --env-file=.env scripts/storage-delete-fix.js
 */
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // MUST BE THE SERVICE ROLE KEY
const BUCKET_NAME = 'donmedia';
const TARGET_PATH = 'magazines/pdfs/Applebees'; // Folder to clean up
const DRY_RUN = false; // Set to true to list files without deleting

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be in your .env file.');
  console.log('Ensure you have:');
  console.log('VITE_SUPABASE_URL=your_project_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false
  }
});

/**
 * Recursively lists all files in a folder
 */
async function getAllFiles(bucket, folderPath) {
  console.log(`🔍 Scanning bucket [${bucket}] for path: ${folderPath}...`);
  const allFiles = [];

  async function recurse(currentPath) {
    const { data, error } = await supabase.storage.from(bucket).list(currentPath);

    if (error) {
      console.error(`  ❌ Error listing ${currentPath}:`, error.message);
      return;
    }

    if (!data || data.length === 0) return;

    for (const item of data) {
      // Supabase .list() returns filenames for items. 
      // We need to build the full path relative to bucket root.
      const fullPath = currentPath ? `${currentPath}/${item.name}` : item.name;

      // Folders usually have no metadata in the list results
      if (item.id === null || !item.metadata) {
        await recurse(fullPath);
      } else {
        allFiles.push(fullPath);
      }
    }
  }

  await recurse(folderPath);
  return allFiles;
}

/**
 * Fallback: Query storage.objects table directly 
 * This finds "stuck" files that might not appear in folder listing
 */
async function getFilesFromDB(bucket, folderPath) {
  console.log(`📖 Querying storage.objects for "stuck" files in: ${folderPath}...`);
  
  // Note: We need to use ilike or prefix matching
  const prefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
  
  const { data, error } = await supabase
    .schema('storage')
    .from('objects')
    .select('name')
    .eq('bucket_id', bucket)
    .ilike('name', `${prefix}%`);

  if (error) {
    console.warn(`  ⚠️ Could not query storage.objects table: ${error.message}`);
    return [];
  }

  return data.map(obj => obj.name);
}

/**
 * Main Execution
 */
async function run() {
  try {
    // 1. Get files via Storage API
    const apiFiles = await getAllFiles(BUCKET_NAME, TARGET_PATH);
    
    // 2. Get files via DB Query (as insurance)
    const dbFiles = await getFilesFromDB(BUCKET_NAME, TARGET_PATH);
    
    // 3. Merge and deduplicate
    const uniqueFiles = [...new Set([...apiFiles, ...dbFiles])];
    
    console.log(`\n📊 Summary:`);
    console.log(`   - Files found via List API: ${apiFiles.length}`);
    console.log(`   - Files found via DB Query: ${dbFiles.length}`);
    console.log(`   - Total unique files to delete: ${uniqueFiles.length}`);

    if (uniqueFiles.length === 0) {
      console.log('✅ No files found to delete.');
      return;
    }

    if (DRY_RUN) {
      console.log('\n--- DRY RUN ---');
      uniqueFiles.forEach(f => console.log(`   [WILL DELETE] ${f}`));
      console.log('--- END DRY RUN ---');
      return;
    }

    // 4. Delete in batches of 100
    const BATCH_SIZE = 100;
    for (let i = 0; i < uniqueFiles.length; i += BATCH_SIZE) {
      const batch = uniqueFiles.slice(i, i + BATCH_SIZE);
      console.log(`\n🗑️ Deleting batch ${Math.floor(i/BATCH_SIZE) + 1} (${batch.length} files)...`);
      
      const { data, error } = await supabase.storage.from(BUCKET_NAME).remove(batch);
      
      if (error) {
        console.error(`  ❌ Batch failed:`, error.message);
      } else {
        console.log(`  ✅ Successfully deleted ${data.length} files.`);
      }
    }

    console.log('\n✨ Cleanup completed successfully.');

  } catch (err) {
    console.error(`\n💥 Fatal Error:`, err);
  }
}

run();
