# @xes/dh-boston-package-manager

> boston远程模块管理器，基于OSS存储Boston远程模块

## Build Setup

``` bash
# install dependencies
npm install

# serve development program
npm run dev

# build for production
npm run build
```

## Config

工程根目录下建立bpm.config.js配置文件，用来配置OSS相关的信息，例如：

```javascript
module.exports = {
  region: 'oss-cn-beijing',
  accessKeyId: 'xxxxxx',
  accessKeySecret: 'xxxxx',
  bucket: 'xxxxx'
};
```

## Use

### 发布Boston Library

```bash
bpm publish xxxx -s 0.1.2
```

### 安装Boston远程Library

```bash
bpm install xxxx
```

## Todos

- [ ] 从运行的当前包目录下，动态抓取版本号
- [ ] 盘点dist目录是否存在和有子文件
- [ ] 增加一个子命令，用来设置cdn域名
