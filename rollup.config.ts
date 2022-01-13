import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import run from "@rollup/plugin-run";
import { join } from "path";
import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

const dev = process.env.ROLLUP_WATCH === "true";

export default defineConfig({
	input: join("src/index.tsx"),
	output: {
		dir: "dist",
		format: "cjs",
		generatedCode: "es5",
		plugins: dev ? [] : [terser()],
	},
	external: [],
	plugins: [
		dev && run(),
		json(),
		nodeResolve({ preferBuiltins: true }),
		typescript(),
		{
			name: "replace-code",
			// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
			transform(code, id) {
				if (!/nbind/.test(id)) return;
				code = code.replace(
					"_a = _typeModule(_typeModule),",
					"var _a = _typeModule(_typeModule);",
				);
				return {
					code,
					map: { mappings: "" },
				};
			},
		},
		babel({
			babelHelpers: "bundled",
			exclude: "node_modules/**",
			presets: [
				"@babel/preset-env",
				[
					"@babel/preset-react",
					{
						runtime: "automatic",
					},
				],
			],
		}),
		commonjs(),
	],
});
