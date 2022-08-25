const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

//function to generate html files
const generateHtmlPlugin = (args) => {
	return new HtmlWebpackPlugin(args);
};

let entry = {};
//loop through the pages folder and create a new html webpack plugin for each one
let plugins = fs.readdirSync(path.resolve(__dirname, "./src/pages/")).map((file) => {
	let name = file.split(".")[0];
	entry[name] = `@ts/${name}.ts`;
	return generateHtmlPlugin({
		pageTitle: name == "index" ? "Login" : name,
		pageName: name,
		filename: file,
		template: path.resolve(__dirname, `./src/pages/${file}`),
		chunks: [name],
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

module.exports = {
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
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						// get the name. E.g. node_modules/packageName/not/this/part.js
						// or node_modules/packageName
						//if there is no node_modules skip.
						if (module.context.indexOf("node_modules") === -1) return false;
						const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
						// npm package names are URL-safe, but some servers don't like @ symbols
						return `npm.${packageName.replace("@", "")}`;
					},
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
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "esbuild-loader",
				options: {
					target: "es2022",
				},
			},
			{
				// typescript
				test: /\.tsx?$/,
				loader: "esbuild-loader",
				options: {
					target: "es2022",
				},
				exclude: /node_modules/,
			},
			{
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: "asset/resource",
				generator: {
					filename: "src/assets/images/[name].[ext]",
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
				type: "asset/resource",
				generator: {
					filename: "src/assets/fonts/[name].[ext]",
				},
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
			},
		],
	},

	resolve: {
		alias: {
			"@ts": path.resolve(__dirname, "./src/ts/"),
			"@utils": path.resolve(__dirname, "./src/utils/"),
			"@assets": path.resolve(__dirname, "./src/assets/"),
			"@pages": path.resolve(__dirname, "./src/pages/"),
			"@components": path.resolve(__dirname, "./src/components/"),
			"@sass": path.resolve(__dirname, "./src/assets/sass/"),
			"@img": path.resolve(__dirname, "./src/assets/img/"),
		},
	},

	plugins: plugins,
};
