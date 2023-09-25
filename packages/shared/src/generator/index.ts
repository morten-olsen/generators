import * as YeomanGenerator from 'yeoman-generator';
import { findRoot } from '@manypkg/find-root';
import * as sortJson from 'sort-json';
import { join } from 'path';
import { merge } from 'lodash';
import simpleGit from 'simple-git';
import { getGitHubRepoFromRemote } from '../git';

type FileSystem = YeomanGenerator['fs'] & {
  prefillJson: (path: string, json: any) => Promise<void>;
  prefill: (path: string, content: string) => Promise<void>;
  sortJson: (path: string) => Promise<void>;
  prefillFiles: (input: {
    json?: Record<string, any>;
    content?: Record<string, string>;
  }) => Promise<void>;
};

abstract class Generator extends YeomanGenerator {
  declare fs: FileSystem;

  constructor(args: any, opts: any) {
    super(args, opts);
    this.argument('location', {
      type: String,
      required: false,
      default: '.',
    });
    this.destinationRoot(this.destinationPath(this.options.location));
    this.fs.prefillJson = async (path, json) => {
      const currentJson = (this.fs.readJSON(path) || {}) as any;
      const newJson = merge({}, json, currentJson) as any;
      await this.fs.writeJSON(path, newJson);
    };
    this.fs.sortJson = async (path) => {
      const currentJson = (this.fs.readJSON(path) || {}) as any;
      const newJson = sortJson(currentJson);
      await this.fs.writeJSON(path, newJson);
    };
    this.fs.prefill = async (path, content) => {
      if (this.fs.exists(path)) {
        return;
      }
      await this.fs.write(path, content);
    };
    this.fs.prefillFiles = async (input) => {
      for (const [path, content] of Object.entries(input.content || {})) {
        await this.fs.prefill(path, content);
      }
      for (const [path, json] of Object.entries(input.json || {})) {
        await this.fs.prefillJson(path, json);
        await this.fs.sortJson(path);
      }
    };
  }

  public initGit = async () => {
    const git = await this.getGit();
    if (await this.isGit()) {
      return;
    }
    await git.init();
  };

  public getRootPackageJson = async () => {
    const rootDir = await this.getRepoRoot();
    const pkg = this.fs.readJSON(join(rootDir, 'package.json')) as any;
    return pkg;
  };

  public getPackages = async () => {
    const { tool, rootDir } = await findRoot(this.destinationRoot());
    const packages = tool.getPackages(rootDir);
    return packages;
  };

  public getPackageJson = async () => {
    const pkg = this.fs.readJSON(this.destinationPath('package.json')) as any;
    return pkg;
  };

  public getGitHubInfo = async () => {
    const rootPkg = await this.getRootPackageJson();
    const fromPkg = await getGitHubRepoFromRemote(rootPkg?.repository?.url);
    const remotes = (await this.getRemotes()).find(
      (remote) => remote.name === 'origin',
    );
    const fromRemote = await getGitHubRepoFromRemote(remotes?.refs.push);
    return fromPkg || fromRemote;
  };

  public getGit = async () => {
    const rootDir = await this.getRepoRoot();
    const git = simpleGit(rootDir);
    return git;
  };

  public isGit = async () => {
    const git = await this.getGit();
    return git.checkIsRepo();
  };

  public getRemotes = async () => {
    const git = await this.getGit();
    if (!(await this.isGit())) {
      return [];
    }
    const remotes = await git.getRemotes(true);
    return remotes;
  };

  public getRepoRoot = async () => {
    const { rootDir } = await findRoot(this.destinationRoot());
    return rootDir;
  };

  public isMonoRepo = async () => {
    const rootDir = await this.getRepoRoot();
    return rootDir !== this.destinationRoot();
  };

  public async install() {
    const rootDir = await this.getRepoRoot();
    this.spawnCommandSync('pnpm', ['install'], {
      cwd: rootDir,
    });
  }
}

export { Generator };
