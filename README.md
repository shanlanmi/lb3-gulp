# gulp 和 loopback 的结合

## 要点
1. 展示拆分gulpfile.js文件的方法，避免task太多后，gulpfile文件臃肿。
1. 部分loopback任务需要启动loopback服务后再执行gulp任务，所以需要建立一个前置任务。
