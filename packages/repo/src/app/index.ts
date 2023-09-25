import { Generator, addPkgSuffix } from '@morten-olsen/generators-shared';
import pkgTmpl from './assets/pkg';
import { join } from 'path';
import tsConfigTmpl from './assets/tsconfig';

const monoRepoGenerator = require('../../package.json').name;

type Answers = {
  root: string;
  repoPkg: string;
  configPkg: string;
};

class RepoGenerator extends Generator {
  public async initializing() {
    const monoRepoConfig = await this.getMonoRepoConfig();
    if (!monoRepoConfig) {
      throw new Error('Please run this generator in an x-repo project');
    }
  }

  public async getMonoRepoConfig() {
    const root = await this.getRepoRoot();
    const monoRepoConfig = this.fs.readJSON(join(root, '.yo-rc.json')) as any;
    if (!monoRepoConfig) {
      return;
    }
    if (!monoRepoConfig[monoRepoGenerator]) {
      return;
    }
    return monoRepoConfig[monoRepoGenerator];
  }
}

class G extends Generator {
  #answers!: Answers;

  public async prompting() {
    const pkg = this.fs.readJSON(this.destinationPath('package.json')) as any;
    const { root } = await this.prompt<Answers>([
      {
        type: 'input',
        name: 'root',
        default: this.config.get('root'),
        message: 'Your mono repos root name',
      },
    ]);

    const { configPkg, repoPkg } = await this.prompt<Answers>([
      {
        type: 'input',
        name: 'configPkg',
        message: 'Your config package name',
        default: this.config.get('config') || addPkgSuffix(root, 'config'),
      },
      {
        type: 'input',
        name: 'repoPkg',
        message: 'Your mono repos package name',
        default: pkg?.name || addPkgSuffix(root, 'repo'),
      },
    ]);

    this.config.set('root', root);
    this.config.set('config', configPkg);
    this.config.save();

    this.#answers = {
      root,
      configPkg,
      repoPkg,
    };
  }

  public async writing() {
    await this.fs.prefillFiles({
      json: {
        [this.destinationPath('package.json')]: {
          ...pkgTmpl,
        },
        [this.destinationPath('packages', 'configs', 'tsconfig.json')]:
          tsConfigTmpl,
      },
      content: {
        [this.destinationPath('.gitignore')]: [
          '/node_modules/',
          '/.pnpm-store/',
          '/.turbo/',
        ].join('\n'),
      },
    });

    this.fs.extendJSON(this.destinationPath('package.json'), {
      name: this.#answers.repoPkg,
    });

    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      {
        ...this.#answers,
      },
      {},
      {
        globOptions: { dot: true },
      },
    );

    this.config.save();
  }
}

export { RepoGenerator };
(G as any).RepoGenerator = RepoGenerator;
module.exports = G;
