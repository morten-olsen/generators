const getGitHubRepoFromRemote = async (remote?: string) => {
  if (!remote) {
    return;
  }
  if (remote.startsWith('git@')) {
    remote = remote.replace(':', '/').replace('git@', 'https://');
  }
  console.log(remote);
  const url = new URL(remote);
  if (url.host !== 'github.com') {
    return;
  }
  const [owner, repo] = url.pathname.split('/').slice(1);
  return { owner, repo: repo.replace('.git', '') };
};

export { getGitHubRepoFromRemote };
