export class Config {
  public llmApiKey: string | undefined;
  public llmModel: string | undefined;
  public githubToken: string | undefined;

  constructor() {
    this.githubToken = process.env.GITHUB_TOKEN;
    if (!this.githubToken) {
      throw new Error("GITHUB_TOKEN is not set");
    }

    this.llmApiKey = process.env.LLM_API_KEY;
    if (!this.llmApiKey) {
      throw new Error("LLM_API_KEY is not set");
    }

    this.llmModel = process.env.LLM_MODEL;
    if (!this.llmModel) {
      throw new Error("LLM_MODEL is not set");
    }
  }

  public loadInputs() {
    if (process.env.DEBUG) {
      console.log("[debug] skip loading inputs");
      return;
    }

    // TODO: handle inputs
  }
}

const config = new Config();
config.loadInputs();

export default config;
