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
