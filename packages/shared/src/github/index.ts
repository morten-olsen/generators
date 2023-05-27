import { Octokit } from 'octokit';

type RepoData = (ReturnType<Octokit['rest']['repos']['get']> extends Promise<
  infer T
>
  ? T
  : never)['data'];
class Client extends Octokit {
  declare getRepo: (
    owner: string,
    repo: string,
  ) => Promise<RepoData | undefined>;

  constructor() {
    super({
      auth: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
    });
    this.getRepo = async (owner: string, repo: string) => {
      try {
        const response = await this.rest.repos.get({
          owner,
          repo,
        });
        return response.data as RepoData;
      } catch (e: unknown) {
        if (typeof e === 'object' && e && 'status' in e && e.status === 404) {
          return;
        }
        throw e;
      }
    };
  }
}

let instance: Client | null = null;

const getGithubClient = () => {
  if (!instance) {
    instance = new Client();
  }
  return instance;
};

export { getGithubClient };
