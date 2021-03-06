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
var manager_1 = require("./manager");
var config_1 = __importDefault(require("./config"));
var package_1 = __importDefault(require("./package"));
var ora_1 = __importDefault(require("ora"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
function default_1(program) {
    program
        .command('publish [name]')
        .description('publish boston library')
        .option('-s, --semver <semver>', 'boston library semantic version')
        .option('-d, --dir <dir>', 'local directory of library', 'dist')
        .option('-t, --type <type>', 'boston library type', 'module')
        .option('-o, --online <online>', 'production environment or not', false)
        .option('-k, --kind <kind>', 'test environment kind', 'local')
        .action(function (name, _a) {
        var semver = _a.semver, dir = _a.dir, type = _a.type, online = _a.online, kind = _a.kind;
        return __awaiter(this, void 0, void 0, function () {
            var spinner, bpm, distPath, result, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        spinner = ora_1.default('publishing boston library...');
                        spinner.start();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        bpm = new manager_1.BostonPackageManager({
                            isOnline: online,
                            testKind: kind
                        });
                        // 如果没有传递semver，则从当前运行目录下的package获取版本号
                        if (!semver) {
                            semver = package_1.default.version;
                        }
                        // 如果没有传递name，则从当前运行目录下的package获取名称
                        if (!name) {
                            name = package_1.default.name;
                        }
                        distPath = path_1.default.resolve(process.cwd(), dir) + '/';
                        if (!fs_1.default.existsSync(distPath)) {
                            throw new Error("\u53D1\u5E03\u5931\u8D25\uFF0C" + distPath + "\u4E0D\u5B58\u5728");
                        }
                        return [4 /*yield*/, bpm.publish(distPath, type, name, semver)];
                    case 2:
                        result = _b.sent();
                        spinner.stop();
                        if (result) {
                            console.log(name + "\u7684v" + semver + "\u7248\u672C\u53D1\u5E03\u6210\u529F\uFF01");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        spinner.stop();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
    program
        .command('install <name> [modules...]')
        .description('install module from boston library')
        .option('-o, --online <online>', 'production environment or not', false)
        .option('-k, --kind <kind>', 'test environment kind', 'local')
        .action(function (name, modules, _a) {
        var online = _a.online, kind = _a.kind;
        return __awaiter(this, void 0, void 0, function () {
            var spinner, bpm, semver, lastAtIndex, ss, result, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        spinner = ora_1.default('installing boston library...');
                        spinner.start();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        bpm = new manager_1.BostonPackageManager({
                            isOnline: online,
                            testKind: kind
                        });
                        semver = void 0;
                        lastAtIndex = name.lastIndexOf('@');
                        if (lastAtIndex > 0) {
                            ss = name.split('@');
                            name = ss[0];
                            semver = ss[1];
                        }
                        return [4 /*yield*/, bpm.install(process.cwd(), name, semver, modules)];
                    case 2:
                        result = _b.sent();
                        spinner.stop();
                        if (result.success) {
                            console.log(name + "\u7684v" + result.version + "\u7248\u672C\u5B89\u88C5\u6210\u529F\uFF01");
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _b.sent();
                        spinner.stop();
                        console.error(e_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    });
    program
        .command('config')
        .description('set customly options of manager')
        .requiredOption('-n --domain <domain>', 'boston registry domain name')
        .action(function (_a) {
        var domain = _a.domain;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                if (domain) {
                    config_1.default.update('domain', domain);
                }
                return [2 /*return*/];
            });
        });
    });
}
exports.default = default_1;

//# sourceMappingURL=index.js.map
