import { EnumModuleType } from '@xes/dh-boston-type';
export declare class BostonPackageManager {
    private _envIsOnline;
    private _testKind;
    private _client;
    private _cdnDomain;
    constructor({ isOnline, testKind }?: {
        isOnline?: boolean | undefined;
        testKind?: string | undefined;
    });
    private get registry();
    private get category();
    publish(localPath: string, type: EnumModuleType, name: string, version: string): Promise<boolean>;
    private updateManifest;
    private getManifest;
    private getOSSFileContent;
    private exist;
    install(localPath: string, name: string, version?: string, dependencies?: string[]): Promise<{
        success: boolean;
        name: string;
        version: string;
    }>;
}
