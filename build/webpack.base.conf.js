'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const {readdirSync} = require('fs');
let excludeEslint = [];
readdirSync('./submodule').forEach(item => {
	excludeEslint.push(resolve(`submodule/${item}/assets`));
});
function resolve (dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	context: path.resolve(__dirname, '../'),
	entry: {
		main: ['babel-polyfill', `./main/main.js`]
	},
	output: {
		path: config.build.assetsRoot,
		filename: '[name].js',
		publicPath: process.env.NODE_ENV === 'production'
			? config.build.assetsPublicPath
			: config.dev.assetsPublicPath
	},
	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'main': resolve(`main`),
			'submodule': resolve(`submodule`),
			'utils': resolve('utils'),
			'static': path.resolve(__dirname, '../static') // 不参与打包文件路径
		}
	},
	module: {
		rules: [
			...(config.dev.useEslint? [{
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [resolve(`submodule`), resolve(`main`),resolve('test')],
				exclude: excludeEslint,
				options: {
					formatter: require('eslint-friendly-formatter'),
					emitWarning: !config.dev.showEslintErrorsInOverlay
				}
			}] : []),
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: [resolve(`submodule`), resolve(`main`), resolve(`node_modules/kd-tree-group`), resolve('static'), resolve('utils'), resolve('test')]
			},
			{
				test: /\.sass$/,
				loaders: ['style', 'css', 'scss']
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	}
}
