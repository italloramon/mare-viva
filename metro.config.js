const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Garantir resolução correta de módulos
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'js', 'jsx', 'ts', 'tsx', 'json'];

module.exports = config;

