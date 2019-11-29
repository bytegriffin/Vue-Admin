// 项目在发布阶段使用的label插件
const prodPlugins = []
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('babel-plugin-transform-remove-console')
}
module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    ...prodPlugins,
    '@babel/plugin-syntax-dynamic-import'
  ]
}
