"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var configPath = path_1.default.resolve(__dirname, '../global.config.json');
var Config = /** @class */ (function () {
    function Config() {
        if (fs_1.default.existsSync(configPath)) {
            var strContent = fs_1.default.readFileSync(configPath, 'utf8');
            this.content = JSON.parse(strContent);
        }
        else {
            this.content = {};
            fs_1.default.writeFileSync(configPath, JSON.stringify(this.content), {
                flag: 'w'
            });
        }
    }
    Config.prototype.update = function (key, val) {
        this.content[key] = val;
        fs_1.default.writeFileSync(configPath, JSON.stringify(this.content), {
            flag: 'w'
        });
    };
    Config.prototype.fetch = function (key) {
        return this.content[key];
    };
    return Config;
}());
exports.default = new Config();

//# sourceMappingURL=config.js.map
