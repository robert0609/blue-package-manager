import { BostonPackageManager } from './manager';
import configHelper from './config';
import packageHelper from './package';
import Commander from 'commander';
import { EnumModuleType } from '@xes/dh-boston-type';
import ora from 'ora';
import path from 'path';
import fs from 'fs';

export default function (program: Commander.Command) {

  program
    .command('publish [name]')
    .description('publish boston library')
    .option('-s, --semver <semver>', 'boston library semantic version')
    .option('-d, --dir <dir>', 'local directory of library', 'dist')
    .option('-t, --type <type>', 'boston library type', 'module')
    .option('-o, --online <online>', 'production environment or not', false)
    .option('-k, --kind <kind>', 'test environment kind', 'super')
    .action(async function (name: string, { semver, dir, type, online, kind }: { semver: string; dir: string; type: EnumModuleType; online: boolean; kind: string; }) {
      const spinner = ora('publishing boston library...');
      spinner.start();
      try {
        const bpm = new BostonPackageManager({
          isOnline: online,
          testKind: kind
        });
        // 如果没有传递semver，则从当前运行目录下的package获取版本号
        if (!semver) {
          semver = packageHelper.version;
        }
        // 如果没有传递name，则从当前运行目录下的package获取名称
        if (!name) {
          name = packageHelper.name;
        }

        const distPath = path.resolve(process.cwd(), dir) + '/';
        if (!fs.existsSync(distPath)) {
          throw new Error(`发布失败，${distPath}不存在`);
        }

        const result = await bpm.publish(distPath, type, name, semver);
        spinner.stop();
        if (result) {
          console.log(`${name}的v${semver}版本发布成功！`);
        }
      } catch (e) {
        spinner.stop();
        console.error(e);
      }
    });

  program
    .command('install <name> [modules...]')
    .description('install module from boston library')
    .option('-o, --online <online>', 'production environment or not', false)
    .option('-k, --kind <kind>', 'test environment kind', 'super')
    .action(async function (name: string, modules: string[], { online, kind }: { online: boolean; kind: string; }) {
      const spinner = ora('installing boston library...');
      spinner.start();
      try {
        const bpm = new BostonPackageManager({
          isOnline: online,
          testKind: kind
        });
        let semver: string | undefined;
        const lastAtIndex = name.lastIndexOf('@');
        if (lastAtIndex > 0) {
          const ss = name.split('@');
          name = ss[0];
          semver = ss[1];
        }
        const result = await bpm.install(process.cwd(), name, semver, modules);
        spinner.stop();
        if (result.success) {
          console.log(`${name}的v${result.version}版本安装成功！`);
        }
      } catch (e) {
        spinner.stop();
        console.error(e);
      }
    });

  program
    .command('config')
    .description('set customly options of manager')
    .requiredOption('-n --domain <domain>', 'boston registry domain name')
    .action(async function ({ domain }: { domain: string }) {
      if (domain) {
        configHelper.update('domain', domain);
      }
    });

}
