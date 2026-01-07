#!/usr/bin/env node
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const CORE_PACKAGES = [
  'react',
  'react-native',
  '@react-native-community/cli',
  '@react-native/babel-preset',
  '@react-native/eslint-config',
  '@react-native/metro-config',
  '@react-native/typescript-config',
  '@types/react',
  'react-test-renderer'
];

function getAllPackages() {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(pkg.dependencies || {});
  const devDependencies = Object.keys(pkg.devDependencies || {});
  return [...dependencies, ...devDependencies].filter(
    (name) => !CORE_PACKAGES.includes(name)
  );
}

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  const pkgs = getAllPackages();
  for (const pkg of pkgs) {
    const answer = await ask(`Nâng cấp ${pkg}? (Enter/Y để nâng cấp, N để skip): `);
    if (answer === '' || /^y(es)?$/i.test(answer)) {
      try {
        console.log(`\n--- Đang nâng cấp ${pkg} ---`);
        execSync(`yarn up ${pkg}`, { stdio: 'inherit' });
      } catch (e) {
        console.error(`Lỗi khi nâng cấp ${pkg}:`, e.message);
      }
    } else {
      console.log(`Bỏ qua ${pkg}`);
    }
  }
  console.log('\nHoàn tất nâng cấp!');
}

main();
