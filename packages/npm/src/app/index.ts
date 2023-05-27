import { RepoGenerator } from 'generator-x-repo';

type Answers = {
  name: string;
  version: string;
};

class G extends RepoGenerator {
  #answers!: Answers;

  constructor(args: any, opts: any) {
    super(args, opts);
  }

  public async prompting() {}

  public async writing() {}
}

module.exports = G;
