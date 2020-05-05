import OSS from 'ali-oss';
import globby from 'globby';
import path from 'path';
import fs from 'fs';
import semver from 'semver';
import { Buffer } from 'buffer';
import { EnumModuleType } from '@xes/dh-boston-type';
import configHelper from './config';

export class BostonPackageManager {
  private _envIsOnline: boolean = false;
  private _testKind: string = 'super';
  private _client: OSS;
  private _cdnDomain: string;

  constructor({
    isOnline = false,
    testKind = 'super'
  } = {}) {
    this._envIsOnline = isOnline;
    this._testKind = testKind;
    const configPath = path.resolve(process.cwd(), 'bpm.config.js');
    if (!fs.existsSync(configPath)) {
      throw new Error('bpm.config.js配置文件不存在');
    }
    const { region, accessKeyId, accessKeySecret, bucket } = require(configPath); // eslint-disable-line
    this._client = new OSS({
      region,
      accessKeyId,
      accessKeySecret,
      bucket
    });
    this._cdnDomain = configHelper.fetch('domain');
  }

  private get registry(): string {
    return 'boston';
  }

  private get category(): string {
    if (this._envIsOnline) {
      return 'online';
    } else {
      return `test_${this._testKind}`;
    }
  }

  async publish(localPath: string, type: EnumModuleType, name: string, version: string): Promise<boolean> {
    const destPath = `${this.registry}/${this.category}/${type === EnumModuleType.module ? 'module' : (type === EnumModuleType.mainApp ? 'mainapp' : 'shellapp')}/${name}/v${version}/`;
    const destExist = await this.exist(destPath);
    if (destExist) {
      throw new Error(`${name}的v${version}版本已经存在，不能重复发布`);
    }
    const files = await globby(`${localPath}**`);
    try {
      if (!files || files.length === 0) {
        throw new Error(`${localPath}下不存在任何文件`);
      }

      const ps = await Promise.all(files.map(fileName => {
        const fn = path.relative(localPath, fileName);
        return this._client.put(`${destPath}${fn}`, fileName);
      }));
      if (ps.every(p => p.res.status === 200)) {
        return await this.updateManifest(type, name, version);
      } else {
        const errorMessages: string[] = [];
        ps.forEach((p, i) => {
          if (p.res.status !== 200) {
            errorMessages.push(`${name}的v${version}版本的${files[i]}发布失败：${p.res.status}`);
          }
        });
        throw new Error(errorMessages.join(';\r\n'));
      }
    } catch (e) {
      throw new Error(`${name}的v${version}版本发布失败：${e.message ? e.message : e.toString()}`);
    }
  }

  private async updateManifest(type: EnumModuleType, name: string, version: string): Promise<boolean> {
    try {
      const manifestPath = `${this.registry}/${this.category}/${type === EnumModuleType.module ? 'module' : (type === EnumModuleType.mainApp ? 'mainapp' : 'shellapp')}/${name}/manifest.json`;
      const manifestExist = await this.exist(manifestPath);
      if (manifestExist) {
        const manifest = await this.getManifest(manifestPath);
        if (semver.gt(version, manifest.version)) {
          manifest.version = version;
          // 更新manifest
          const r1 = await this._client.put(manifestPath, Buffer.from(JSON.stringify(manifest)));
          if (r1.res.status === 200) {
            return true;
          } else {
            throw new Error(`${name}的v${version}版本manifest更新失败：${r1.res.status}`);
          }
        } else {
          return true;
        }
      } else {
        // 新建manifest
        const r = await this._client.put(manifestPath, Buffer.from(JSON.stringify({
          version
        })));
        if (r.res.status === 200) {
          return true;
        } else {
          throw new Error(`${name}的v${version}版本manifest更新失败：${r.res.status}`);
        }
      }
    } catch (e) {
      throw new Error(`${name}的v${version}版本manifest更新失败：${e.message ? e.message : e.toString()}`);
    }
  }

  private async getManifest(manifestPath: string) {
    return JSON.parse(await this.getOSSFileContent(manifestPath));
  }

  private async getOSSFileContent(filePath: string): Promise<string> {
    const r = await this._client.get(filePath);
    if (r.res.status === 200) {
      return r.content ? r.content.toString() : '';
    } else {
      throw new Error(`${filePath}获取失败：${r.res.status}`)
    }
  }

  private async exist(objectName: string): Promise<boolean> {
    try {
      const r = await this._client.list({
        prefix: objectName,
        delimiter: '/',
        'max-keys': 100
      }, {});
      if (r.res.status === 200) {
        return Boolean(r.objects && r.objects.length > 0);
      } else {
        throw new Error(`判断${objectName}存在处理发生异常：status: ${r.res.status}`);
      }
    } catch (e) {
      if (e.code === 'NoSuchKey') {
        return false;
      }
      throw new Error(`判断${objectName}存在处理发生异常：error: ${e.code}`);
    }
  }

  async install(localPath: string, name: string, version?: string, dependencies?: string[]): Promise<{
    success: boolean;
    name: string;
    version: string;
  }> {

    if (!this._cdnDomain) {
      throw new Error('请设置微模块registry域名，设置方法：bpm config --domain "xxxx"');
    }

    if (!fs.existsSync(localPath)) {
      fs.mkdirSync(localPath, { recursive: true });
    }
    const manifestLocalPath = path.resolve(localPath, 'remoteDependencies.json');
    let manifestLocal: {
      [key: string]: string
    } = {};
    if (fs.existsSync(manifestLocalPath)) {
      manifestLocal = JSON.parse(fs.readFileSync(manifestLocalPath, 'utf8'));
    }

    if (!version) {
      // 如果没有传入版本号，默认取最新版本
      const manifestRemote = await this.getManifest(`${this.registry}/${this.category}/module/${name}/manifest.json`);
      version = manifestRemote.version;
    }

    // 获取指定版本远程依赖包的模块索引
    const remoteModulePath = `${this.registry}/${this.category}/module/${name}/v${version}/`;
    if (!await this.exist(remoteModulePath)) {
      throw new Error(`安装失败：远程模块${name}不存在${version}版本`);
    }
    const remoteModuleJson = JSON.parse(await this.getOSSFileContent(`${remoteModulePath}index.json`));
    const remoteModuleJsFile = `${remoteModulePath}index.js`;
    const remoteModuleCssFile = `${remoteModulePath}index.css`;

    const jsExist = await this.exist(remoteModuleJsFile);
    if (!jsExist) {
      throw new Error(`安装失败：远程模块${name}不存在js入口文件`);
    }

    if (!dependencies || dependencies.length === 0) {
      // 如果没有传入依赖模块列表，默认将所有的依赖模块转为远程依赖
      dependencies = Object.keys(remoteModuleJson);
    }

    dependencies.forEach(d => {
      const exportsName = remoteModuleJson[d].exportName;
      if (exportsName) {
        manifestLocal[d] = `${this._cdnDomain}/${remoteModuleJsFile}!${exportsName}`;
      } else {
        throw new Error(`安装失败：依赖模块${d}不在远程模块${name}的导出列表`);
      }
    });

    if (!manifestLocal['runtimeCss']) {
      const cssExist = await this.exist(remoteModuleCssFile);
      if (cssExist) {
        manifestLocal['runtimeCss'] = `${this._cdnDomain}/${remoteModuleCssFile}`;
      }
    }

    // 写入本地远程依赖文件
    fs.writeFileSync(manifestLocalPath, JSON.stringify(manifestLocal, null, 2), {
      flag: 'w'
    });

    return {
      success: true,
      name,
      version: version as string
    }
  }
};
