import path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs";
import Dotenv from "dotenv-webpack";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//function to generate html files
const generateHtmlPlugin = (args) => {
	return new HtmlWebpackPlugin(args);
};

let entry = {};
entry["shared"] = { import: ["@features/globals.ts"] };
//loop through the pages folder and create a new html webpack plugin for each one
let plugins = fs.readdirSync(path.resolve(__dirname, "./src/ts/pages/")).map((file) => {
	let name = file.split(".")[0];
	entry[name] = { import: `@ts/pages/${name}.ts` };
	return generateHtmlPlugin({
		pageTitle: name == "index" ? "Login" : name,
		pageName: name,
		template: path.resolve(__dirname, `./src/partials/index.hbs`),
		chunks: ["shared", name],
	});
});

plugins.push(
	new MiniCssExtractPlugin({
		filename: "src/assets/css/[name].css",
		chunkFilename: "src/assets/css/[name].chunk.css",
	})
);

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
		path: path.resolve(__dirname, `./.env.prod`),
	})
);

export default {
	mode: "production",
	experiments: {
		topLevelAwait: true,
	},
	entry: entry,

	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "src/js/[name].js",
	},
	/*optimization: {
		runtimeChunk: "single",
		splitChunks: {
			cacheGroups: {
				//combinar todo el js de las librerias en un solo archivo
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all",
				},
				//combiar todo el css en un solo archivo
				styles: {
					name: "styles",
					test: /\.s?css$/,
					chunks: "all",
					minChunks: 1,
					reuseExistingChunk: true,
					enforce: true,
				},
			},
		},
	},*/
	//create one js file per vendor
	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				//combiar todo el vendor(css de librerias js) en un solo archivo
				styles: {
					name: "vendors",
					test: /\.css$/,
					chunks: "all",
					minChunks: 1,
					reuseExistingChunk: true,
					enforce: true,
				},
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						//if there is no node_modules skip.
						if (module.context.indexOf("node_modules") === -1) return false;
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						// npm package names are URL-safe, but some servers don't like @ symbols
						return `vendors/npm.${packageName.replace("@", "")}`;
					},
				},
			},
		},
	},

	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "ts-loader",
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
				test: /\.(woff(2)?|eot|ttf|otf)$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/fonts/")],
				generator: {
					filename(file) {
						return file.filename;
					},
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
			},
			{
				test: /\.hbs$/,
				use: ["handlebars-loader"],
			},
			{
				test: /\.html$/,
				type: "asset/resource",
				include: [path.resolve(__dirname, "./src/assets/templates/")],
				generator: {
					filename: "src/assets/templates/[base]",
				},
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
			handlebars: "handlebars/dist/handlebars.min.js",
		},
	},

	plugins: plugins,
};
