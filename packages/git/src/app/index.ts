import { getGithubClient } from '@morten-olsen/generators-shared';
import { RepoGenerator } from 'generator-x-repo';
import { join } from 'path';

type Answers = {
  current: string;
  owner: string;
  repo: string;
  existing: boolean;
  isPrivate: boolean;
};

class G extends RepoGenerator {
  #answers!: Answers;

  constructor(args: any, opts: any) {
    super(args, opts);
  }

  public async prompting() {
    const githubInfo = await this.getGitHubInfo();
    const github = await getGithubClient();
    const currentUser = await github.rest.users.getAuthenticated();

    const { owner, repo } = await this.prompt<Answers>([
      {
        type: 'input',
        name: 'owner',
        message: 'Repo owner',
        default: githubInfo?.owner || currentUser.data.login,
      },
      {
        type: 'input',
        name: 'repo',
        message: 'Repo name',
        default: githubInfo?.repo,
      },
    ]);

    const currentRepo = await github.getRepo(owner, repo);

    let isPrivate = currentRepo?.private || false;

    if (!currentRepo) {
      const { isPrivate: isPrivateAnswer } = await this.prompt<{
        isPrivate: string;
      }>([
        {
          type: 'list',
          choices: ['public', 'private'],
          name: 'isPrivate',
          message: 'Is private',
          default: true,
        },
      ]);
      isPrivate = isPrivateAnswer === 'private';
    }

    this.#answers = {
      current: currentUser.data.login,
      owner,
      repo,
      existing: !!currentRepo,
      isPrivate: isPrivate,
    };
  }

  public async writing() {
    const { owner, repo, existing, current, isPrivate } = this.#answers;
    await this.initGit();
    const git = await this.getGit();
    const github = await getGithubClient();
    const remotes = await this.getRemotes();
    const url = `https://github.com/${owner}/${repo}.git`;
    const origin = remotes.find((remote) => remote.name === 'origin');
    if (origin) {
      await git.removeRemote(origin.name);
    }
    await git.addRemote('origin', url);
    const packages = await this.getPackages();
    for (const pkg of [
      packages.rootDir,
      ...packages.packages.map((p) => p.dir),
    ]) {
      await this.fs.extendJSON(join(pkg, 'package.json'), {
        repository: {
          type: 'git',
          url: `git+${url}`,
        },
      });
    }
    if (!existing) {
      if (owner !== current) {
        github.rest.repos.createInOrg({
          name: repo,
          org: owner,
          private: isPrivate,
          auto_init: false,
        });
      } else {
        github.rest.repos.createForAuthenticatedUser({
          name: repo,
          private: isPrivate,
          auto_init: false,
        });
      }
    }
  }
}

module.exports = G;
