# axios如何取消请求、原理
本质上axios是对 XMLHttpRequest 的封装，取消请求时，使用XMLHttpRequest实例的 abort() 方法即可取消请求。