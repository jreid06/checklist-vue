/* eslint-disable prettier/prettier */
module.exports = {
    transpileDependencies: ["vuetify"],
    outputDir: "docs",
    pwa: {
        themeColor: '#000',
        workboxOptions: {
            skipWaiting: true
        }
    }
};