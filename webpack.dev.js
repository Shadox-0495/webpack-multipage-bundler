import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import Dotenv from "dotenv-webpack";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { loader } from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//function to generate html files
const generateHtmlPlugin = (args) => {
	return new HtmlWebpackPlugin(args);
};

let entry = {};
entry["icons-loader"] = { import: ["@features/icons-loader.ts"] };
//loop through the pages folder and create a new html webpack plugin for each one
let plugins = fs.readdirSync(path.resolve(__dirname, "./src/pages/")).map((file) => {
	let name = file.split(".")[0];
	entry[name] = { import: `@ts/${name}.ts` };
	return generateHtmlPlugin({
		pageTitle: name == "index" ? "Login" : name,
		pageName: name,
		filename: file,
		template: path.resolve(__dirname, `./src/pages/${file}`),
		chunks: [name, "icons-loader"],
	});
});
//push the global variable of the jquery library to the webpack bundle
plugins.push(
	new webpack.ProvidePlugin({
		$: "jquery",
		jQuery: "jquery",
	})
);
//push the clean webpack plugin to the webpack plugins array
plugins.push(new CleanWebpackPlugin());
plugins.push(
	new Dotenv({
		path: path.resolve(__dirname, `./.env.dev`),
	})
);

export default {
	mode: "development",
	experiments: {
		topLevelAwait: true,
	},
	target: ["web", "es5"],
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, "./"),
		open: true,
		compress: true,
		hot: true,
		port: 8081,
	},

	//entry: path.resolve(__dirname, "./src/ts/index.ts"),
	//entry: "@ts/index.ts",
	entry: entry,

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "src/js/[name].js",
	},

	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "ts-loader",
				options: {
					compilerOptions: {
						outDir: "./dist",
					},
				},
				exclude: /node_modules/,
			},
			{
				test: /\.svg$/,
				type: "asset/inline",
				include: [path.resolve(__dirname, "./src/assets/img/all-icons.svg")],
				generator: {
					dataUrl: (content) => {
						return content.toString(); //only all-icons.svg can be loaded as plain text for later beign inserted into the page's body as <svg>
					},
				},
			},
			{
				test: /\.svg$/,
				type: "asset/inline",
				include: [path.resolve(__dirname, "./src/assets/img/")],
				exclude: /\b(all-icons)\.svg$/, //exclude the all-icons.svg so it doesn't load as base64 or any other encode
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/img/")],
				generator: {
					filename: "src/assets/images/[name].[ext]",
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/fonts/")],
				generator: {
					filename: "src/assets/fonts/[name].[ext]",
				},
			},
			/*{
				test: /\.html$/,
				type: "asset/inline",
				include: [path.resolve(__dirname, "./src/assets/templates/")],
				generator: {
					dataUrl: (content) => {
						return content.toString(); //get all the templates files from the html into plain text to be loaded using js and append to body
					},
				},
			},*/
			{
				test: /\.hbs$/,
				loader: "handlebars-loader",
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
			},
		],
	},

	resolve: {
		extensions: ["", ".js", ".jsx", ".ts", ".tsx"],
		alias: {
			"@ts": path.resolve(__dirname, "./src/ts/"),
			"@utils": path.resolve(__dirname, "./src/utils/"),
			"@assets": path.resolve(__dirname, "./src/assets/"),
			"@pages": path.resolve(__dirname, "./src/pages/"),
			"@components": path.resolve(__dirname, "./src/components/"),
			"@features": path.resolve(__dirname, "./src/features/"),
			"@sass": path.resolve(__dirname, "./src/assets/sass/"),
			"@img": path.resolve(__dirname, "./src/assets/img/"),
		},
	},

	plugins: plugins,
};
