import { readFileSync, writeFileSync } from "fs";

const targetVersion = process.env.npm_package_version;

const sourceDir = "src";

// read minAppVersion from manifest.json and bump version to target version
const manifestFilePath = `${sourceDir}/manifest.json`;
let manifest = JSON.parse(readFileSync(manifestFilePath, "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync(manifestFilePath, JSON.stringify(manifest, null, "\t"));

// update versions.json with target version and minAppVersion from manifest.json
let versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
