/* eslint-disable prettier/prettier */
module.exports = {
    transpileDependencies: ["vuetify"],
    outputDir: "docs",
    pwa: {
        workboxOptions: {
            skipWaiting: true
        }
    }
};