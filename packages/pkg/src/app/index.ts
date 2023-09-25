import pkgTmpl from './assets/pkg';
import { RepoGenerator } from 'generator-x-repo';
import { createTsConfigCjs } from './assets/tsconfig.cjs';
import { createTsConfigEsm } from './assets/tsconfig.esm';
import { createTsConfigLibs } from './assets/tsconfig.libs';
import { createTsConfig } from './assets/tsconfig';

type Answers = {
  name: string;
  version: string;
};

class G extends RepoGenerator {
  #answers!: Answers;

  constructor(args: any, opts: any) {
    super(args, opts);
  }

  public async prompting() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json')) as any;
    const rootPkg = this.fs.readJSON(
      this.destinationPath(await this.getRepoRoot(), 'package.json'),
    ) as any;

    const { name, version } = await this.prompt<Answers>([
      {
        type: 'input',
        name: 'name',
        message: 'Your package name',
        default: pkg?.name,
      },
      {
        type: 'input',
        name: 'version',
        message: 'Your package version',
        default: rootPkg?.version || '0.0.1',
      },
    ]);

    this.#answers = {
      name,
      version,
    };
  }

  public async writing() {
    const monoRepoConfig = await this.getMonoRepoConfig();
    const { config } = monoRepoConfig;

    this.fs.extendJSON(this.destinationPath('package.json'), {
      name: this.#answers.name,
    });

    await this.addDevDependencies({
      [config]: 'workspace:^',
    });

    await this.fs.prefillFiles({
      json: {
        [this.destinationPath('package.json')]: pkgTmpl,
        [this.destinationPath('configs/tsconfig.cjs.json')]:
          createTsConfigCjs(config),
        [this.destinationPath('configs/tsconfig.esm.json')]:
          createTsConfigEsm(config),
        [this.destinationPath('configs/tsconfig.libs.json')]:
          createTsConfigLibs(),
        [this.destinationPath('tsconfig.json')]: createTsConfig(),
      },
      content: {
        [this.destinationPath('.gitignore')]: ['/node_modules/', '/dist/'].join(
          '\n',
        ),
        [this.destinationPath('src/index.ts')]: '// code here\n',
      },
    });
  }
}

module.exports = G;
