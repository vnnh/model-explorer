// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
	mount: {
		/* ... */
		public: "/",
		src: "/scripts",
	},
	plugins: [
		/* ... */
		"@snowpack/plugin-typescript",
		"@snowpack/plugin-react-refresh",
		"@snowpack/plugin-dotenv",
	],
	packageOptions: {},
	devOptions: {
		hmr: true,
		port: 8081,
	},
	buildOptions: {
		out: "out",
	},

	optimize: {
		//bundle: true,
		//minify: true,
	},
};
