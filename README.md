# Presubmit - AI Code Reviewer

[![GitHub last commit](https://img.shields.io/github/last-commit/presubmit/ai-reviewer)](https://github.com/presubmit/ai-reviewer/commits)
[![GitHub Stars](https://img.shields.io/github/stars/presubmit/ai-reviewer?style=social)](https://github.com/presubmit/ai-reviewer/stargazers)
[![GitHub License](https://img.shields.io/github/license/presubmit/ai-reviewer?color=yellow)](https://github.com/presubmit/ai-reviewer/blob/main/LICENSE)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/presubmitai?style=social)](https://x.com/intent/follow?screen_name=presubmitai)

> 🤝 **Note**: Presubmit is designed to complement human reviewers, not replace them. It helps catch security issues and bugs early on while also providing context about the overall change, making the human review process more efficient.

AI code review assistant that helps teams streamline their review process by providing preliminary feedback on pull requests. It acts as a first-pass reviewer, highlighting potential issues and providing context - empowering human reviewers to focus on architectural decisions and complex logic rather than catching basic issues.

- 📝 **Line-by-Line Review**: Detailed line-by-line comments, catching bugs, suggesting improvements, and explaining complex changes
- 📊 **Smart Summaries**: Concise summaries of changes that help reviewers understand PR impact
- 💬 **Interactive**: Responds to questions and requests in PR comments
- ⚡ **Time-Saving**: Catches bugs early, letting reviewers to focus on more complex design

![review example](https://github.com/presubmit/ai-reviewer/blob/main/assets/review_example.png?raw=true)

## Usage

### Step 1: Add LLM_API_KEY secret

1. Go to your repository's Settings > Secrets and Variables > Actions
2. Click "New repository secret"
3. Add a new secret with:
   - Name: `LLM_API_KEY`
   - Value: Your API key from one of these providers:
     - [Anthropic Console](https://console.anthropic.com/) (Claude)
     - [OpenAI API](https://platform.openai.com/api-keys) (GPT-4)
     - [Google AI Studio](https://aistudio.google.com/app/apikeys) (Gemini)

### Step 2: Create GitHub Workflow

Add this GitHub Action to your repository by creating `.github/workflows/presubmit.yml`:

```yaml
name: Presubmit.ai

permissions:
  contents: read
  pull-requests: write
  issues: write

on:
  pull_request:
  pull_request_review_comment:
    types: [created]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: presubmit/ai-reviewer@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
          LLM_MODEL: "claude-3-5-sonnet-20241022"
```

The action requires:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `LLM_API_KEY`: Your API key (added in step 1)
- `LLM_MODEL`: Which LLM model to use. Make sure the model is [supported](https://github.com/presubmit/ai-reviewer/blob/main/src/ai.ts) and matches the `LLM_API_KEY`.

## Features

### 🤖 Smart Reviews

- **In-depth Analysis**: Line-by-line review with context-aware suggestions
- **Auto PR Summary**: Concise, meaningful summaries of changes
- **Code Quality**: Catches bugs, anti-patterns, and style issues
- **Interactive**: Responds to questions and clarifications in comments

### 🛡️ Security & Quality

- **Vulnerability Detection**: Catches security issues and leaked secrets
- **Best Practices**: Enforces coding standards and security guidelines
- **Performance**: Identifies potential bottlenecks and optimizations
- **Documentation**: Ensures proper code documentation and clarity

### ⚡ Developer Experience

- **2-Minute Setup**: Quick integration with GitHub Actions
- **Smart PR Titles**: Auto-generates descriptive and meaningful titles
- **Real-time**: Instant feedback on your pull requests
- **24/7 Available**: Round-the-clock code reviews

_Production-ready, secure, and ready to review your code!_ 🚀

## Show Your Support! ⭐

If you find Presubmit helpful in improving the review process:

- **Star this repository** to show your support and help others discover it
- Share your experience by creating a [GitHub Issue](https://github.com/presubmit/ai-reviewer/issues)
- Follow me on [X/Twitter](https://x.com/bdstanga) for updates
- Consider [contributing](CONTRIBUTING.md) to make it even better

Your support motivates us! 🙏

---

🖤 by [Presubmit](https://x.com/presubmitai)
