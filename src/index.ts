import { BostonPackageManager } from './manager';
import Commander from 'commander';
import { EnumModuleType } from '@xes/dh-boston-type';
import ora from 'ora';
import path from 'path';

export default function (program: Commander.Command) {

  program
    .command('publish <name>')
    .description('publish boston library')
    .requiredOption('-s, --semver <semver>', 'boston library semantic version')
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
        const result = await bpm.publish(path.resolve(process.cwd(), dir) + '/', type, name, semver);
        spinner.stop();
        if (result) {
          console.log(`${name}的v${semver}版本发布成功！`);
        }
      } catch (e) {
        spinner.stop();
        throw e;
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
        throw e;
      }
    });

}
