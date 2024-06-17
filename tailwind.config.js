/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.{js,jsx,ts,tsx}",
		"node_modules/flowbite-react/lib/esm/**/*.js",
	],
	theme: {
		fontFamily: {
			montserrat: ["montserrat"],
		},
		colors: {
			semigrey: "#D9D9D9",
		},
		extend: {},
	},
	plugins: [require("flowbite/plugin")],
};
