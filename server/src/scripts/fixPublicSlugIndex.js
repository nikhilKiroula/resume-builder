/**
 * Migration: Fix publicSlug index
 * 
 * The publicSlug field had a non-sparse unique index created on first run.
 * This script drops it and recreates it as sparse so multiple null values are allowed.
 * 
 * Run once: node src/scripts/fixPublicSlugIndex.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';

const run = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected');

    const db = mongoose.connection.db;
    const collection = db.collection('resumes');

    // List existing indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    // Drop the bad publicSlug index (non-sparse)
    const badIndex = indexes.find(i => i.key?.publicSlug !== undefined && !i.sparse);
    if (badIndex) {
      console.log(`Dropping bad index: ${badIndex.name}`);
      await collection.dropIndex(badIndex.name);
      console.log('✅ Dropped old index');
    } else {
      console.log('ℹ️  No non-sparse publicSlug index found (already fixed or doesn\'t exist)');
    }

    // Recreate with sparse: true
    await collection.createIndex({ publicSlug: 1 }, { unique: true, sparse: true, name: 'publicSlug_sparse' });
    console.log('✅ Created new sparse unique index on publicSlug');

    await mongoose.disconnect();
    console.log('Done! You can now create multiple resumes.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

run();
