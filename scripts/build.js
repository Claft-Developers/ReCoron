#!/usr/bin/env node

const { execSync } = require('child_process');

function runCommand(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

function build() {
  console.log('🚀 Starting build process...\n');

  // Step 1: Generate Prisma Client
  if (!runCommand('prisma generate', 'Generating Prisma Client')) {
    process.exit(1);
  }

  // Step 2: Deploy migrations (allow to fail)
  console.log('\n🔄 Deploying database migrations...');
  try {
    execSync('prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Database migrations deployed');
  } catch (error) {
    console.warn('⚠️  Migration deployment failed, but continuing build...');
    console.warn('   This might be expected if database is not accessible during build.');
    console.warn('   Make sure to run migrations manually if needed.');
  }

  // Step 3: Build Next.js
  if (!runCommand('next build', 'Building Next.js application')) {
    process.exit(1);
  }

  console.log('\n✨ Build completed successfully!\n');
}

build();
