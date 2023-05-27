const addPkgSuffix = (root: string, suffix: string) => {
  if (root.startsWith('@')) {
    const [scope, pkg] = root.split('/');
    if (!pkg) {
      return [scope, suffix].join('/');
    }
    return [scope, [pkg, suffix].join('-')].join('/');
  }
  return [root, suffix].join('-');
};

export { addPkgSuffix };
