# UDP

+ UDP是一个面向无连接，不可靠的`传输层`协议
+ `首部结构简单`，是传输时开销最小，如果想发送很短的报文，并且安全性要求不高可以使用UDP


## UDP的封装格式

![image.png](http://tva1.sinaimg.cn/large/006vSZ9Ugy1gxlrqum0evj30jv085gnq.jpg)


+ UDP长度：包含数据的长度，可以算出数据的结束位置
+ UDP校验和：UDP的差错控制

## UDP应用
+ QQ等聊天工具
+ 视频软件
+ TFTP 文件传输协议