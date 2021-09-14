import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import livereload from "rollup-plugin-livereload";
import css from "rollup-plugin-css-only";
import replace from "rollup-plugin-replace";
import { terser } from "rollup-plugin-terser";

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
				stdio: ["ignore", "inherit", "inherit"],
				shell: true,
			});

			process.on("SIGTERM", toExit);
			process.on("exit", toExit);
		},
	};
}

export default {
	input: "src/main.tsx",
	output: {
		sourcemap: true,
		format: "iife",
		name: "app",
		file: "public/build/bundle.js",
	},
	plugins: [
		replace({
			"process.env.NODE_ENV": JSON.stringify("production"),
		}),
		css({ output: "bundle.css" }),
		resolve({ browser: true }),
		commonjs(),
		typescript({ sourceMap: !production, inlineSources: !production }),
		!production && serve(),
		!production && livereload(),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};
