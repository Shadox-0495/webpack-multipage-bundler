const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
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
	mode: "development",
	experiments: {
		topLevelAwait: true,
	},
	target: ["web", "es5"],
	devServer: {
		historyApiFallback: true,
		static: path.resolve(__dirname, "./dist"),
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
				use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
			},
		],
	},

	resolve: {
		extensions: [".tsx", ".jsx", ".ts", ".js"],
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
