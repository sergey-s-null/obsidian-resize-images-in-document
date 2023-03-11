import esbuild from "esbuild";
import builtins from "builtin-modules";
import path from "path";
import {copy} from 'esbuild-plugin-copy';
import dotenv from "dotenv";
import fs from "fs";

const envFileName = fs.existsSync(".env.user")
	? ".env.user"
	: ".env";

const configOutput = dotenv.config({path: envFileName});
if (configOutput.error) {
	console.error(configOutput.error);
	process.exit(1);
}

const banner = `
/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = (process.argv[2] === "production");

const sourceDir = "src";
const outputDir = process.env.OUTPUT_DIR;

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: [
		path.join(sourceDir, "main.ts"),
		path.join(sourceDir, "styles.css")
	],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outdir: outputDir,
	plugins: [
		copy({
			resolveFrom: "cwd",
			assets: {
				from: `${sourceDir}/manifest.json`,
				to: outputDir
			},
			watch: true
		})
	]
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	fs.closeSync(fs.openSync(`${outputDir}/.hotreload`, "w"));
	await context.watch();
}
