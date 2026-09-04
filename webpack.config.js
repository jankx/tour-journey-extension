/**
 * webpack.config.js – tour-journey extension
 *
 * Builds the Tour Journey Gutenberg blocks from `blocks/<name>/src/index.tsx`
 * into `blocks/<name>/build/index.js` (as referenced by each block.json).
 */

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const EXTENSION_DIR = __dirname;

const filteredPlugins = (defaultConfig.plugins || []).filter((plugin) => {
    const name = plugin.constructor?.name ?? '';
    return name !== 'CopyPlugin' && name !== 'CleanWebpackPlugin';
});

module.exports = {
    ...defaultConfig,
    context: EXTENSION_DIR,

    entry: {
        'blocks/tour-journey/build/index': './blocks/tour-journey/src/index.tsx',
        'blocks/tour-journey-destination/build/index': './blocks/tour-journey-destination/src/index.tsx',
        'blocks/tour-journey-time/build/index': './blocks/tour-journey-time/src/index.tsx',
        'blocks/tour-journey-details/build/index': './blocks/tour-journey-details/src/index.tsx',
    },

    output: {
        ...defaultConfig.output,
        path: EXTENSION_DIR,
        filename: '[name].js',
        clean: false,
    },

    plugins: filteredPlugins,
};
