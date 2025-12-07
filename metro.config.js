const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Transpile react-native-pager-view for web compatibility
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts.push('cjs');

module.exports = config;
