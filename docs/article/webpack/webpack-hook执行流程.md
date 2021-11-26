# Webpack hook执行流程



## environment call



## afterEnvironment call



调用插件

+ **WatchIgnorePlugin**



## entryOption call



参数：

+ context 工作目录
+ entry：入口配置

调用插件

+ **EntryOptionPlugin**



## afterPlugins call

参数：

+ compiler



## afterResolvers call

参数：

+ compiler

调用插件

+ AMDPlugin



## beforeRun callAsync

参数：

+ compiler

调用插件

+ NodeEnvironmentPlugin



## run callAsync

参数：

+ compiler

调用插件

+ CachePlugin





## normalModuleFactory call

参数：

+ normalModuleFactory

调用插件：

+ IgnorePlugin
+ NormalModuleReplacementPlugin
+ SideEffectsFlagPlugin



## contextModuleFactory call

参数：

+ contextModuleFactory

调用插件

+ ContextExclusionPlugin
+ ContextReplacementPlugin
+ IgnorePlugin



## beforeCompile call

参数：

```javascript
{
			normalModuleFactory,
			contextModuleFactory,
			compilationDependencies: new Set()
}
```



调用插件

+ DllReferencePlugin



## compile call

参数

```
{
			normalModuleFactory,
			contextModuleFactory,
			compilationDependencies: new Set()
}
```

调用插件

+ DelegatedPlugin
+ DllReferencePlugin
+ ExternalsPlugin



## thisCompilation call

参数

+ compilation

+ params

  ```
  {
  			normalModuleFactory,
  			contextModuleFactory,
  			compilationDependencies: new Set()
  }
  ```

调用插件

+ EnvironmentPlugin
+ LibraryTemplatePlugin
+ WarnNoModeSetPlugin
+ NodeTemplatePlugin
+ ReadFileCompileWasmTemplatePlugin
+ AggressiveMergingPlugin
+ AggressiveSplittingPlugin
+ RuntimeChunkPlugin
+ SplitChunksPlugin
+ FetchCompileWasmTemplatePlugin
+ JsonpTemplatePlugin
+ WebWorkerTemplatePlugin



## compilation call

参数

+ compilation

+ params

  ```
  {
  			normalModuleFactory,
  			contextModuleFactory,
  			compilationDependencies: new Set()
  }
  ```

调用插件

+ APIPlugin
+ AutomaticPrefetchPlugin
+ BannerPlugin
+ CommonJsStuffPlugin
+ CompatibilityPlugin
+ ConstPlugin
+ DefinePlugin
+ DelegatedPlugin
+ DllEntryPlugin
+ DllReferencePlugin
+ DynamicEntryPlugin
+ EvalDevToolModulePlugin
+ EvalSourceMapDevToolPlugin
+ ExtendedAPIPlugin
+ FlagAllModulesAsUsedPlugin
+ FlagDependencyExportsPlugin
+ FlagDependencyUsagePlugin
+ FlagInitialModulesAsUsedPlugin
+ FunctionModulePlugin
+ HashedModuleIdsPlugin
+ HotModuleReplacementPlugin
+ JavascriptModulesPlugin
+ JsonModulesPlugin
+ LoaderOptionsPlugin
+ LoaderTargetPlugin
+ MultiEntryPlugin
+ NamedChunksPlugin
+ NamedModulesPlugin
+ NodeStuffPlugin
+ NoEmitOnErrorsPlugin
+ PrefetchPlugin
+ ProgressPlugin
+ ProvidePlugin
+ RecordIdsPlugin
+ RequireJsStuffPlugin
+ SingleEntryPlugin
+ SourceMapDevToolPlugin
+ TemplatedPathPlugin
+ UseStrictPlugin
+ WarnCaseSensitiveModulesPlugin
+ ProfilingPlugin
+ AMDPlugin
+ CommonJsPlugin
+ HarmonyModulesPlugin
+ ImportPlugin
+ LoaderPlugin
+ RequireContextPlugin
+ RequireEnsurePlugin
+ RequireIncludePlugin
+ SystemPlugin
+ NodeSourcePlugin
+ ChunkModuleIdRangePlugin
+ EnsureChunkConditionsPlugin
+ FlagIncludedChunksPlugin
+ LimitChunkCountPlugin
+ MergeDuplicateChunksPlugin
+ MinChunkSizePlugin
+ ModuleConcatenationPlugin
+ NaturalChunkOrderPlugin
+ OccurrenceOrderChunkIdsPlugin
+ OccurrenceOrderModuleIdsPlugin
+ OccurrenceOrderPlugin
+ RemoveEmptyChunksPlugin
+ RemoveParentModulesPlugin
+ SideEffectsFlagPlugin
+ WasmFinalizeExportsPlugin
+ WebAssemblyModulesPlugin
+ TerserPlugin





## make call

参数

+ compilation

调用插件

+ AutomaticPrefetchPlugin
+ DllEntryPlugin
+ DynamicEntryPlugin
+ MultiEntryPlugin
+ PrefetchPlugin
+ SingleEntryPlugin （主流程）





## compilation.addEntry call

参数

+ entry

  SingleEntryDependency 对象

+ name



调用插件

+ ProgressPlugin



## normalModuleFactory.beforeResolve callAsync

参数

```
{
				contextInfo: {
					compiler: undefined
					issuer: '文件完整路径'
				},
				resolveOptions,
				context,  // 工作目录
				request, // 代码里写的路径，比如import xx from './xxx',这里的值就是./xxx
				dependencies // 模块的依赖
}
```



调用插件

+ ContextReplacementPlugin
+ IgnorePlugin
+ NormalModuleReplacementPlugin





## normalModuleFactory.factory call

参数：null

调用插件

+ DelegatedModuleFactoryPlugin
+ ExternalModuleFactoryPlugin
+ NormalModuleFactory的构造函数中被tap（主流程）



## normalModuleFactory.resolver call

参数：null

调用插件

+ NormalModuleFactory的构造函数中被tap（主流程）



## normalModuleFactory.createParser.for call

参数

+ parserOptions



调用插件

+ JavascriptModulesPlugin
+ JsonModulesPlugin
+ WebAssemblyModulesPlugin



## normalModuleFactory.parser.for call

参数

+ parser
+ parserOptions

调用参数

+ APIPlugin
+ CommonJsStuffPlugin
+ CompatibilityPlugin
+ ConstPlugin
+ DefinePlugin
+ ExtendedAPIPlugin
+ NodeStuffPlugin
+ ProvidePlugin
+ RequireJsStuffPlugin
+ UseStrictPlugin
+ ProfilingPlugin
+ AMDPlugin
+ CommonJsPlugin
+ HarmonyModulesPlugin
+ ImportPlugin
+ RequireEnsurePlugin
+ RequireIncludePlugin
+ SystemPlugin
+ NodeSourcePlugin
+ ModuleConcatenationPlugin





## normalModuleFactory.createGenerator.for call

参数

+ generator
+ generatorOptions

调用插件

+ JavascriptModulesPlugin
+ JsonModulesPlugin
+ WebAssemblyModulesPlugin



## normalModuleFactory.generator.for call

参数

+ generator
+ generatorOptions



调用插件：无





## normalModuleFactory.afterResolve callAsync

参数

```javascript
{
  context: context,  // 文件所在目录
  request: loaders
  dependencies: data.dependencies, // 文件的依赖类型
  userRequest, // 当前文件完整路径 
  rawRequest: request, // 相对路径，例如import xx from './xxx'  这里就是./xxx
  loaders,
  resource, // 文件完整路径
  matchResource,
  resourceResolveData, // 详情看下面
  settings: {
    type:'javascript/auto',
    userRequest
  },
  type: 'javascript/auto',
  parser: this.getParser(type, settings.parser),
  generator: this.getGenerator(type, settings.generator),
  resolveOptions // 
}
```

```
resourceResolveData
{
  "context":{
  	"issuer":"最后实际被哪个文件引用"
  },
  "path":"/Users/yuangong/Desktop/code/学习/rollup-treeshaking/demo-1/node_modules/@tuhu/mpapi-adapter/dist/lib/mpapi-adapter.js",
  "query":"",
  "file":false,
  "descriptionFilePath":"package.json路径",
  "descriptionFileData":{}, // package.json配置
  "descriptionFileRoot":"文件目录",
  "relativePath":"./dist/lib/xxx.js",
  "__innerRequest_relativePath":"./dist/lib/xxxx.js",
  "__innerRequest":"./dist/lib/xxx.js",
  "module":false,
  "alreadyTriedMainField":"package.json路径"
}
```



调用插件

+ ContextReplacementPlugin
+ NormalModuleReplacementPlugin



## normalModuleFactory.createModule call

参数：同上

调用插件: 无



## normalModuleFactory.module call

参数

+ module
+ 同上

调用插件

+ DelegatedModuleFactoryPlugin
+ EvalDevToolModuleTemplatePlugin
+ EvalSourceMapDevToolModuleTemplatePlugin
+ SideEffectsFlagPlugin



## compilation.buildModule call

参数

+ module

调用插件

+ ProgressPlugin
+ SourceMapDevToolModuleOptionsPlugin
+ TerserPlugin



## compilation.normalModuleLoader call

参数

+ loaderContext

  ```javascript
  const loaderContext = {
  			version: 2,
  			emitWarning: warning => {
  			},
  			emitError: error => {
  			},
  			getLogger: name => {
  			},
  			// TODO remove in webpack 5
  			exec: (code, filename) => {
  			},
  			resolve(context, request, callback) {
  			},
  			getResolve(options) {
  			},
  			emitFile: (name, content, sourceMap, assetInfo) => {
  			},
  			rootContext: options.context,
  			webpack: true,
  			sourceMap: !!this.useSourceMap,
  			mode: options.mode || "production",
  			_module: this,
  			_compilation: compilation,
  			_compiler: compilation.compiler,
  			fs: fs
  		}
  ```

调用插件

+ HotModuleReplacementPlugin
+ LoaderOptionsPlugin
+ LoaderTargetPlugin
+ LoaderPlugin





## parser.program call

参数

+ ast
+ comments

调用插件

+ UseStrictPlugin
+ HarmonyDetectionParserPlugin



## parser.xxx call

参数

+ ast





## compilation.succeedModule call

参数

+ module

调用插件

+ ProgressPlugin



## compilation.succeedEntry call

参数

+ entry
+ name
+ module



## compilation.finishModules callAsync

参数

+ modules

调用插件

+ FlagDependencyExportsPlugin

  遍历所有 `module` 将 `export` 出来的变量以数组的形式，单独存储到 `module.buildMeta.providedExports`变量下。

+ WasmFinalizeExportsPlugin

+ ProgressPlugin



## compilation.seal call

参数：无

调用插件

+ WarnCaseSensitiveModulesPlugin



## compilation.optimizeDependenciesBasic call

参数

+ modules

调用插件：无



## compilation.optimizeDependencies call

参数

+ modules

调用插件

+ FlagAllModulesAsUsedPlugin
+ FlagDependencyUsagePlugin
+ SideEffectsFlagPlugin





## compilation.optimizeDependenciesAdvanced call

参数

+ modules

调用插件：无





## compilation.afterOptimizeDependencies call

参数

+ modules

调用插件



## compilation.beforeChunks call

参数：无

调用插件
