declare class Config {
    private content;
    constructor();
    update(key: string, val: string): void;
    fetch(key: string): string;
}
declare const _default: Config;
export default _default;
