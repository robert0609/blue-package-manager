"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ali_oss_1 = __importDefault(require("ali-oss"));
var globby_1 = __importDefault(require("globby"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var semver_1 = __importDefault(require("semver"));
var buffer_1 = require("buffer");
var dh_boston_type_1 = require("@xes/dh-boston-type");
var config_1 = __importDefault(require("./config"));
var BostonPackageManager = /** @class */ (function () {
    function BostonPackageManager(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.isOnline, isOnline = _c === void 0 ? false : _c, _d = _b.testKind, testKind = _d === void 0 ? 'super' : _d;
        this._envIsOnline = false;
        this._testKind = 'super';
        this._envIsOnline = isOnline;
        this._testKind = testKind;
        var configPath = path_1.default.resolve(process.cwd(), 'bpm.config.js');
        if (!fs_1.default.existsSync(configPath)) {
            throw new Error('bpm.config.js配置文件不存在');
        }
        var _e = require(configPath), region = _e.region, accessKeyId = _e.accessKeyId, accessKeySecret = _e.accessKeySecret, bucket = _e.bucket; // eslint-disable-line
        this._client = new ali_oss_1.default({
            region: region,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            bucket: bucket
        });
        this._cdnDomain = config_1.default.fetch('domain');
    }
    Object.defineProperty(BostonPackageManager.prototype, "registry", {
        get: function () {
            return 'boston';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BostonPackageManager.prototype, "category", {
        get: function () {
            if (this._envIsOnline) {
                return 'online';
            }
            else {
                return "test_" + this._testKind;
            }
        },
        enumerable: true,
        configurable: true
    });
    BostonPackageManager.prototype.publish = function (localPath, type, name, version) {
        return __awaiter(this, void 0, void 0, function () {
            var destPath, destExist, files, ps, errorMessages_1, e_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        destPath = this.registry + "/" + this.category + "/" + (type === dh_boston_type_1.EnumModuleType.module ? 'module' : (type === dh_boston_type_1.EnumModuleType.mainApp ? 'mainapp' : 'shellapp')) + "/" + name + "/v" + version + "/";
                        return [4 /*yield*/, this.exist(destPath)];
                    case 1:
                        destExist = _a.sent();
                        if (destExist) {
                            throw new Error(name + "\u7684v" + version + "\u7248\u672C\u5DF2\u7ECF\u5B58\u5728\uFF0C\u4E0D\u80FD\u91CD\u590D\u53D1\u5E03");
                        }
                        return [4 /*yield*/, globby_1.default(localPath + "**")];
                    case 2:
                        files = _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 8, , 9]);
                        if (!files || files.length === 0) {
                            throw new Error(localPath + "\u4E0B\u4E0D\u5B58\u5728\u4EFB\u4F55\u6587\u4EF6");
                        }
                        return [4 /*yield*/, Promise.all(files.map(function (fileName) {
                                var fn = path_1.default.relative(localPath, fileName);
                                return _this._client.put("" + destPath + fn, fileName);
                            }))];
                    case 4:
                        ps = _a.sent();
                        if (!ps.every(function (p) { return p.res.status === 200; })) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.updateManifest(type, name, version)];
                    case 5: return [2 /*return*/, _a.sent()];
                    case 6:
                        errorMessages_1 = [];
                        ps.forEach(function (p, i) {
                            if (p.res.status !== 200) {
                                errorMessages_1.push(name + "\u7684v" + version + "\u7248\u672C\u7684" + files[i] + "\u53D1\u5E03\u5931\u8D25\uFF1A" + p.res.status);
                            }
                        });
                        throw new Error(errorMessages_1.join(';\r\n'));
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        e_1 = _a.sent();
                        throw new Error(name + "\u7684v" + version + "\u7248\u672C\u53D1\u5E03\u5931\u8D25\uFF1A" + (e_1.message ? e_1.message : e_1.toString()));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    BostonPackageManager.prototype.updateManifest = function (type, name, version) {
        return __awaiter(this, void 0, void 0, function () {
            var manifestPath, manifestExist, manifest, r1, r, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        manifestPath = this.registry + "/" + this.category + "/" + (type === dh_boston_type_1.EnumModuleType.module ? 'module' : (type === dh_boston_type_1.EnumModuleType.mainApp ? 'mainapp' : 'shellapp')) + "/" + name + "/manifest.json";
                        return [4 /*yield*/, this.exist(manifestPath)];
                    case 1:
                        manifestExist = _a.sent();
                        if (!manifestExist) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.getManifest(manifestPath)];
                    case 2:
                        manifest = _a.sent();
                        if (!semver_1.default.gt(version, manifest.version)) return [3 /*break*/, 4];
                        manifest.version = version;
                        return [4 /*yield*/, this._client.put(manifestPath, buffer_1.Buffer.from(JSON.stringify(manifest)))];
                    case 3:
                        r1 = _a.sent();
                        if (r1.res.status === 200) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error(name + "\u7684v" + version + "\u7248\u672Cmanifest\u66F4\u65B0\u5931\u8D25\uFF1A" + r1.res.status);
                        }
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, true];
                    case 5: return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, this._client.put(manifestPath, buffer_1.Buffer.from(JSON.stringify({
                            version: version
                        })))];
                    case 7:
                        r = _a.sent();
                        if (r.res.status === 200) {
                            return [2 /*return*/, true];
                        }
                        else {
                            throw new Error(name + "\u7684v" + version + "\u7248\u672Cmanifest\u66F4\u65B0\u5931\u8D25\uFF1A" + r.res.status);
                        }
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        e_2 = _a.sent();
                        throw new Error(name + "\u7684v" + version + "\u7248\u672Cmanifest\u66F4\u65B0\u5931\u8D25\uFF1A" + (e_2.message ? e_2.message : e_2.toString()));
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    BostonPackageManager.prototype.getManifest = function (manifestPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.getOSSFileContent(manifestPath)];
                    case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
                }
            });
        });
    };
    BostonPackageManager.prototype.getOSSFileContent = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var r;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._client.get(filePath)];
                    case 1:
                        r = _a.sent();
                        if (r.res.status === 200) {
                            return [2 /*return*/, r.content ? r.content.toString() : ''];
                        }
                        else {
                            throw new Error(filePath + "\u83B7\u53D6\u5931\u8D25\uFF1A" + r.res.status);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    BostonPackageManager.prototype.exist = function (objectName) {
        return __awaiter(this, void 0, void 0, function () {
            var r, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this._client.list({
                                prefix: objectName,
                                delimiter: '/',
                                'max-keys': 100
                            }, {})];
                    case 1:
                        r = _a.sent();
                        if (r.res.status === 200) {
                            return [2 /*return*/, Boolean(r.objects && r.objects.length > 0)];
                        }
                        else {
                            throw new Error("\u5224\u65AD" + objectName + "\u5B58\u5728\u5904\u7406\u53D1\u751F\u5F02\u5E38\uFF1Astatus: " + r.res.status);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        if (e_3.code === 'NoSuchKey') {
                            return [2 /*return*/, false];
                        }
                        throw new Error("\u5224\u65AD" + objectName + "\u5B58\u5728\u5904\u7406\u53D1\u751F\u5F02\u5E38\uFF1Aerror: " + e_3.code);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    BostonPackageManager.prototype.install = function (localPath, name, version, dependencies) {
        return __awaiter(this, void 0, void 0, function () {
            var manifestLocalPath, manifestLocal, manifestRemote, remoteModulePath, remoteModuleJson, _a, _b, remoteModuleJsFile, remoteModuleCssFile, jsExist, cssExist;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!this._cdnDomain) {
                            throw new Error('请设置微模块registry域名，设置方法：bpm config --domain "xxxx"');
                        }
                        if (!fs_1.default.existsSync(localPath)) {
                            fs_1.default.mkdirSync(localPath, { recursive: true });
                        }
                        manifestLocalPath = path_1.default.resolve(localPath, 'remoteDependencies.json');
                        manifestLocal = {};
                        if (fs_1.default.existsSync(manifestLocalPath)) {
                            manifestLocal = JSON.parse(fs_1.default.readFileSync(manifestLocalPath, 'utf8'));
                        }
                        if (!!version) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getManifest(this.registry + "/" + this.category + "/module/" + name + "/manifest.json")];
                    case 1:
                        manifestRemote = _c.sent();
                        version = manifestRemote.version;
                        _c.label = 2;
                    case 2:
                        remoteModulePath = this.registry + "/" + this.category + "/module/" + name + "/v" + version + "/";
                        return [4 /*yield*/, this.exist(remoteModulePath)];
                    case 3:
                        if (!(_c.sent())) {
                            throw new Error("\u5B89\u88C5\u5931\u8D25\uFF1A\u8FDC\u7A0B\u6A21\u5757" + name + "\u4E0D\u5B58\u5728" + version + "\u7248\u672C");
                        }
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, this.getOSSFileContent(remoteModulePath + "index.json")];
                    case 4:
                        remoteModuleJson = _b.apply(_a, [_c.sent()]);
                        remoteModuleJsFile = remoteModulePath + "index.js";
                        remoteModuleCssFile = remoteModulePath + "index.css";
                        return [4 /*yield*/, this.exist(remoteModuleJsFile)];
                    case 5:
                        jsExist = _c.sent();
                        if (!jsExist) {
                            throw new Error("\u5B89\u88C5\u5931\u8D25\uFF1A\u8FDC\u7A0B\u6A21\u5757" + name + "\u4E0D\u5B58\u5728js\u5165\u53E3\u6587\u4EF6");
                        }
                        if (!dependencies || dependencies.length === 0) {
                            // 如果没有传入依赖模块列表，默认将所有的依赖模块转为远程依赖
                            dependencies = Object.keys(remoteModuleJson);
                        }
                        dependencies.forEach(function (d) {
                            var exportsName = remoteModuleJson[d];
                            if (exportsName) {
                                manifestLocal[d] = _this._cdnDomain + "/" + remoteModuleJsFile + "!" + exportsName;
                            }
                            else {
                                throw new Error("\u5B89\u88C5\u5931\u8D25\uFF1A\u4F9D\u8D56\u6A21\u5757" + d + "\u4E0D\u5728\u8FDC\u7A0B\u6A21\u5757" + name + "\u7684\u5BFC\u51FA\u5217\u8868");
                            }
                        });
                        if (!!manifestLocal['runtimeCss']) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.exist(remoteModuleCssFile)];
                    case 6:
                        cssExist = _c.sent();
                        if (cssExist) {
                            manifestLocal['runtimeCss'] = this._cdnDomain + "/" + remoteModuleCssFile;
                        }
                        _c.label = 7;
                    case 7:
                        // 写入本地远程依赖文件
                        fs_1.default.writeFileSync(manifestLocalPath, JSON.stringify(manifestLocal, null, 2), {
                            flag: 'w'
                        });
                        return [2 /*return*/, {
                                success: true,
                                name: name,
                                version: version
                            }];
                }
            });
        });
    };
    return BostonPackageManager;
}());
exports.BostonPackageManager = BostonPackageManager;
;

//# sourceMappingURL=manager.js.map
