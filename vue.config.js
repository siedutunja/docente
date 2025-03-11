module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: '/docente/',
  outputDir: 'docente',
  configureWebpack: {
    resolve: {
       symlinks: false
    }
  },
  transpileDependencies: [
    '@coreui/utils',
    '@coreui/vue'
  ]
}
