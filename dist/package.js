"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var packagePath = path_1.default.resolve(process.cwd(), 'package.json');
var PackageInfo = /** @class */ (function () {
    function PackageInfo() {
        this._package = null;
    }
    Object.defineProperty(PackageInfo.prototype, "name", {
        get: function () {
            try {
                this.readPackageFile();
                return this._package['name'];
            }
            catch (e) {
                throw new Error("\u4ECEpackage\u4E2D\u8BFB\u53D6name\u5931\u8D25\uFF0C" + (e.message ? e.message : e.toString()));
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PackageInfo.prototype, "version", {
        get: function () {
            try {
                this.readPackageFile();
                return this._package['version'];
            }
            catch (e) {
                throw new Error("\u4ECEpackage\u4E2D\u8BFB\u53D6version\u5931\u8D25\uFF0C" + (e.message ? e.message : e.toString()));
            }
        },
        enumerable: true,
        configurable: true
    });
    PackageInfo.prototype.readPackageFile = function () {
        if (this._package) {
            return;
        }
        if (fs_1.default.existsSync(packagePath)) {
            this._package = require(packagePath);
        }
        else {
            throw new Error(packagePath + "\u4E0D\u5B58\u5728");
        }
    };
    return PackageInfo;
}());
exports.default = new PackageInfo();

//# sourceMappingURL=package.js.map
