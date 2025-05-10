const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

config.resolver = {
  ...config.resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg" && ext !== "mjs" && ext !== "cjs"),
  sourceExts: [...resolver.sourceExts, "svg", "mjs", "cjs"],
  unstable_enablePackageExports: true,
};

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
