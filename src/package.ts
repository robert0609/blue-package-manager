import path from 'path';
import fs from 'fs';

const packagePath = path.resolve(process.cwd(), 'package.json');

class PackageInfo {
  private _package: any; // eslint-disable-line

  constructor() {
    this._package = null;
  }

  get name(): string {
    try {
      this.readPackageFile();
      return this._package['name'];
    } catch (e) {
      throw new Error(`从package中读取name失败，${e.message ? e.message : e.toString()}`);
    }
  }

  get version(): string {
    try {
      this.readPackageFile();
      return this._package['version'];
    } catch (e) {
      throw new Error(`从package中读取version失败，${e.message ? e.message : e.toString()}`);
    }
  }

  private readPackageFile() {
    if (this._package) {
      return;
    }

    if (fs.existsSync(packagePath)) {
      this._package = require(packagePath);
    } else {
      throw new Error(`${packagePath}不存在`);
    }
  }
}

export default new PackageInfo();
