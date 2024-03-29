# babel-plugin-polyfill-corejs3

**作用：为代码注入core-js3 的运行时代码**

```js {87,198}
// 作用：为代码注入core-js3 的运行时代码
var _default = (0, _helperDefinePolyfillProvider.default)(function ({
  getUtils,
  method,
  shouldInjectPolyfill,
  createMetaResolver,
  debug,
  babel
}, {
  version = 3,
  proposals,
  shippedProposals,
  [runtimeCompat]: {
    useBabelRuntime,
    ext = ".js"
  } = {}
}) {
  const isWebpack = babel.caller(caller => (caller == null ? void 0 : caller.name) === "babel-loader");
  const resolve = createMetaResolver({
    global: _builtInDefinitions.BuiltIns,
    static: _builtInDefinitions.StaticProperties,
    instance: _builtInDefinitions.InstanceProperties
  });
  const available = new Set((0, _getModulesListForTargetVersion.default)(version));

  function getCoreJSPureBase(useProposalBase) {
    return useBabelRuntime ? useProposalBase ? `${useBabelRuntime}/core-js` : `${useBabelRuntime}/core-js-stable` : useProposalBase ? "core-js-pure/features" : "core-js-pure/stable";
  }

  function maybeInjectGlobalImpl(name, utils) {
    if (shouldInjectPolyfill(name)) {
      debug(name);
      utils.injectGlobalImport((0, _utils.coreJSModule)(name));
      return true;
    }

    return false;
  }

  function maybeInjectGlobal(names, utils, fallback = true) {
    for (const name of names) {
      if (fallback) {
        esnextFallback(name, name => maybeInjectGlobalImpl(name, utils));
      } else {
        maybeInjectGlobalImpl(name, utils);
      }
    }
  }

  function maybeInjectPure(desc, hint, utils, object) {
    if (desc.pure && !(object && desc.exclude && desc.exclude.includes(object)) && esnextFallback(desc.name, shouldInjectPolyfill)) {
      const {
        name
      } = desc;
      let useProposalBase = false;

      if (proposals || shippedProposals && name.startsWith("esnext.")) {
        useProposalBase = true;
      } else if (name.startsWith("es.") && !available.has(name)) {
        useProposalBase = true;
      }

      const coreJSPureBase = getCoreJSPureBase(useProposalBase);
      return utils.injectDefaultImport( // $FlowIgnore, we already guard desc.pure
      `${coreJSPureBase}/${desc.pure}${ext}`, hint);
    }
  }

  function isFeatureStable(name) {
    if (name.startsWith("esnext.")) {
      const esName = `es.${name.slice(7)}`; // If its imaginative esName is not in latest compat data, it means
      // the proposal is not stage 4

      return esName in _data.default;
    }

    return true;
  }

  return {
    name: "corejs3",
    polyfills: _data.default,

    filterPolyfills(name) {
      if (!available.has(name)) return false;
      // 全量引入的plyfill全部筛选通过
      if (proposals || method === "entry-global") return true;

      if (shippedProposals && _shippedProposals.default.has(name)) {
        return true;
      }

      return isFeatureStable(name);
    },

    entryGlobal(meta, utils, path) {
      if (meta.kind !== "import") return;
      const modules = (0, _utils.isCoreJSSource)(meta.source);
      if (!modules) return;

      if (modules.length === 1 && meta.source === (0, _utils.coreJSModule)(modules[0]) && shouldInjectPolyfill(modules[0])) {
        // Avoid infinite loop: do not replace imports with a new copy of
        // themselves.
        debug(null);
        return;
      }

      maybeInjectGlobal(modules, utils, false);
      path.remove();
    },

    usageGlobal(meta, utils) {
      const resolved = resolve(meta);
      if (!resolved) return;
      let deps = resolved.desc.global;

      if (resolved.kind !== "global" && meta.object && meta.placement === "prototype") {
        const low = meta.object.toLowerCase();
        deps = deps.filter(m => m.includes(low) || _builtInDefinitions.CommonInstanceDependencies.has(m));
      }

      maybeInjectGlobal(deps, utils);
    },

    usagePure(meta, utils, path) {
      if (meta.kind === "in") {
        if (meta.key === "Symbol.iterator") {
          path.replaceWith(t.callExpression(utils.injectDefaultImport((0, _utils.coreJSPureHelper)("is-iterable", useBabelRuntime, ext), "isIterable"), [path.node.right]));
        }

        return;
      }

      if (path.parentPath.isUnaryExpression({
        operator: "delete"
      })) return;
      let isCall;

      if (meta.kind === "property") {
        // We can't compile destructuring.
        if (!path.isMemberExpression()) return;
        if (!path.isReferenced()) return;
        isCall = path.parentPath.isCallExpression({
          callee: path.node
        });

        if (meta.key === "Symbol.iterator") {
          if (!shouldInjectPolyfill("es.symbol.iterator")) return;

          if (isCall) {
            if (path.parent.arguments.length === 0) {
              path.parentPath.replaceWith(t.callExpression(utils.injectDefaultImport((0, _utils.coreJSPureHelper)("get-iterator", useBabelRuntime, ext), "getIterator"), [path.node.object]));
              path.skip();
            } else {
              (0, _utils.callMethod)(path, utils.injectDefaultImport((0, _utils.coreJSPureHelper)("get-iterator-method", useBabelRuntime, ext), "getIteratorMethod"));
            }
          } else {
            path.replaceWith(t.callExpression(utils.injectDefaultImport((0, _utils.coreJSPureHelper)("get-iterator-method", useBabelRuntime, ext), "getIteratorMethod"), [path.node.object]));
          }

          return;
        }
      }

      let resolved = resolve(meta);
      if (!resolved) return;

      if (useBabelRuntime && resolved.desc.pure && resolved.desc.pure.slice(-6) === "/index") {
        // Remove /index, since it doesn't exist in @babel/runtime-corejs3s
        resolved = _extends({}, resolved, {
          desc: _extends({}, resolved.desc, {
            pure: resolved.desc.pure.slice(0, -6)
          })
        });
      }

      if (resolved.kind === "global") {
        const id = maybeInjectPure(resolved.desc, resolved.name, utils);
        if (id) path.replaceWith(id);
      } else if (resolved.kind === "static") {
        const id = maybeInjectPure(resolved.desc, resolved.name, utils, // $FlowIgnore
        meta.object);
        if (id) path.replaceWith(id);
      } else if (resolved.kind === "instance") {
        const id = maybeInjectPure(resolved.desc, `${resolved.name}InstanceProperty`, utils, // $FlowIgnore
        meta.object);
        if (!id) return;

        if (isCall) {
          (0, _utils.callMethod)(path, id);
        } else {
          path.replaceWith(t.callExpression(id, [path.node.object]));
        }
      }
    },

    // 按需引入的逻辑
    visitor: method === "usage-global" && {
      // import("foo")
      CallExpression(path) {
        if (path.get("callee").isImport()) {
          const utils = getUtils(path);

          if (isWebpack) {
            // Webpack uses Promise.all to handle dynamic import.
            maybeInjectGlobal(_builtInDefinitions.PromiseDependenciesWithIterators, utils);
          } else {
            maybeInjectGlobal(_builtInDefinitions.PromiseDependencies, utils);
          }
        }
      },

      // (async function () { }).finally(...)
      Function(path) {
        if (path.node.async) {
          maybeInjectGlobal(_builtInDefinitions.PromiseDependencies, getUtils(path));
        }
      },

      // for-of, [a, b] = c
      "ForOfStatement|ArrayPattern"(path) {
        maybeInjectGlobal(_builtInDefinitions.CommonIterators, getUtils(path));
      },

      // [...spread]
      SpreadElement(path) {
        if (!path.parentPath.isObjectExpression()) {
          maybeInjectGlobal(_builtInDefinitions.CommonIterators, getUtils(path));
        }
      },

      // yield*
      YieldExpression(path) {
        if (path.node.delegate) {
          maybeInjectGlobal(_builtInDefinitions.CommonIterators, getUtils(path));
        }
      }

    }
  };
});
```