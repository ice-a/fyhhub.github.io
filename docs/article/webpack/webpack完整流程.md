# webpack完整流程
1.**compile函数，即将开始编译**

2.**创建NormalModuleFactory模块工厂**

4.**创建Compilation对象**

6.**addEntry**

7.**模块工厂即将开始create模块**

8.**执行 beforeResolve 钩子，即将开始解析模块，如果返回空，可以跳过模块解析**

9.**即将通过 解析工厂 获取 解析器**

10.**执行 resolveOptions 钩子，获取解析配置选项，并创建解析器**

11.**开始解析文件路径**

12.**解析文件，获取文件query参数，获取文件是否是目录或者模块**

13.**解析package.json文件内容和路径**

14.**处理alias配置，解析真实路径**

15.**获取到文件路径以及package.json的一些信息**

16.**获取文件需要执行的loader列表**

17.**resolver解析loader文件路径**

18.**分别获取到post, noraml, pre三种loader的三个数组**

19.**即将创建Parser和Generator**

20.**创建Parser对象，并执行一些parser对象钩子**

21.**创建Generator对象，并执行一些generator钩子**

22.**解析完 模块文件和loader的路径以及其他所有文件信息**

23.**执行afterResolve钩子 代表已经解析完成**

24.**创建NormalModule**

25.**建立模块与依赖关系，即将开始构建模块buildModule**

26.**开始doBuild，并开始创建loader上下文对象**

27.**开始runLoader**

28.**loader执行完毕，获取结果**

29.**开始编译模块**

32.**创建ConstDependency，HarmoneyImportSideEffectDependency依赖**

33.**当一个被导入变量被使用到时创建HarmonyImportSpecifierDependency依赖**

34.**编译和依赖收集完成**

36.**执行succeedModule钩子**

37.**处理模块依赖**

38.**添加模块依赖**

39.**重复从  “7” 开始进行**

40.**完成模块树创建，执行succeedEntry钩子**

41.**执行finishModules钩子**
