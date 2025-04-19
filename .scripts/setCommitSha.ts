#!/usr/bin/env ts-node

// scripts/set-commit-sha.js
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const commitSha = execSync("git rev-parse --short HEAD").toString().trim();
const commitMsg = execSync("git log -1 --pretty=%B").toString().trim();

const pkgPath = path.resolve(__dirname, "../constants/commitSha.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

pkg["commitSha"] = commitSha;
pkg["commitMsg"] = commitMsg;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`✅ Updated commit-sha to: ${commitSha}`);
console.log(`✅ Updated commit-msg to: ${commitMsg}`);
