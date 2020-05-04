declare class PackageInfo {
    private _package;
    constructor();
    get name(): string;
    get version(): string;
    private readPackageFile;
}
declare const _default: PackageInfo;
export default _default;
