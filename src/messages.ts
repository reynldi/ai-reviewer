import { context } from "@actions/github";
import { FileDiff } from "./diff";
import { AIComment, PullRequestSummary } from "./prompts";
import { Context } from "@actions/github/lib/context";

export const OVERVIEW_MESSAGE_SIGNATURE =
  "\n<!-- presubmit.ai: overview message -->";

export const COMMENT_SIGNATURE = "\n<!-- presubmit.ai: comment -->";

export const PAYLOAD_TAG_OPEN = "\n<!-- presubmit.ai: payload --";
export const PAYLOAD_TAG_CLOSE = "\n-- presubmit.ai: payload -->";

const PRESUBMIT_SIGNATURE = "\n";

export function buildLoadingMessage(
  baseCommit: string,
  commits: {
    sha: string;
    commit: {
      message: string;
    };
  }[],
  fileDiffs: FileDiff[]
): string {
  const { owner, repo } = context.repo;

  let message = `⏳ **Analyzing changes in this PR...** ⏳\n\n`;
  message += `_This might take a few minutes, please wait_\n\n`;

  // Group files by operation
  message += `<details>\n<summary>📥 Commits</summary>\n\n`;
  message += `Analyzing changes from base (\`${baseCommit.slice(
    0,
    7
  )}\`) to latest commit (\`${commits[commits.length - 1].sha.slice(
    0,
    7
  )}\`):\n`;

  for (const commit of commits.reverse()) {
    message += `- [${commit.sha.slice(
      0,
      7
    )}](https://github.com/${owner}/${repo}/commit/${commit.sha}): ${
      commit.commit.message
    }\n`;
  }

  message += "\n\n</details>\n\n";

  message += `<details>\n<summary>📁 Files being considered (${fileDiffs.length})</summary>\n\n`;
  for (const diff of fileDiffs) {
    let prefix = "🔄"; // Modified
    if (diff.status === "added") prefix = "➕";
    if (diff.status === "removed") prefix = "➖";
    if (diff.status === "renamed") prefix = "📝";

    let fileText = `${prefix} ${diff.filename}`;
    if (diff.status === "renamed") {
      fileText += ` (from ${diff.previous_filename})`;
    }
    fileText += ` _(${diff.hunks.length} ${
      diff.hunks.length === 1 ? "hunk" : "hunks"
    })_`;
    message += `${fileText}\n`;
  }
  message += "\n</details>\n\n";

  message += PRESUBMIT_SIGNATURE;
  message += OVERVIEW_MESSAGE_SIGNATURE;

  return message;
}

export function buildOverviewMessage(
  summary: PullRequestSummary,
  commits: string[]
): string {
  let message = `## PR Summary\n\n`;

  // Add description with proper spacing
  message += `${summary.description.trim()}\n\n`;

  message += `### Changes\n\n`;

  // Create table with proper column alignment and escaping
  message += `| File | Summary |\n`;
  message += `|:----------|:---------------|\n`; // Left-align columns

  for (const file of summary.files) {
    // Escape pipes and wrap paths in backticks for better formatting
    const escapedPath = file.filename.replace(/\|/g, "\\|");
    const escapedSummary = file.summary.replace(/\|/g, "\\|");

    message += `| \`${escapedPath}\` | ${escapedSummary} |\n`;
  }

  const payload = {
    commits: commits,
  };

  message += PRESUBMIT_SIGNATURE;
  message += OVERVIEW_MESSAGE_SIGNATURE;
  message += PAYLOAD_TAG_OPEN;
  message += JSON.stringify(payload);
  message += PAYLOAD_TAG_CLOSE;

  return message;
}

export function buildReviewSummary(
  context: Context,
  files: FileDiff[],
  commits: {
    sha: string;
    commit: {
      message: string;
    };
  }[],
  actionableComments: AIComment[],
  skippedComments: AIComment[]
) {
  const { owner, repo } = context.repo;

  let body = "";
  if (actionableComments.length === 0) {
    body += `✅ **LGTM!**\n\n`;
  } else {
    body += `🚨 **Pull request needs attention.**\n\n`;
  }

  body += "### Review Summary\n\n";

  // Commits section
  body += `<details>\n<summary>Commits Considered (${commits.length})</summary>\n\n`;
  for (const commit of commits) {
    body += `- [${commit.sha.slice(
      0,
      7
    )}](https://github.com/${owner}/${repo}/commit/${commit.sha}): ${
      commit.commit.message
    }\n`;
  }
  body += "\n</details>\n\n";

  // Files section
  body += `<details>\n<summary>Files Processed (${files.length})</summary>\n\n`;
  for (const diff of files) {
    let fileText = `- ${diff.filename}`;
    if (diff.status === "renamed") {
      fileText += ` (from ${diff.previous_filename})`;
    }
    fileText += ` _(${diff.hunks.length} ${
      diff.hunks.length === 1 ? "hunk" : "hunks"
    })_`;
    body += `${fileText}\n`;
  }
  body += "\n</details>\n\n";

  // Actionable comments section
  body += `<details>\n<summary>Actionable Comments (${actionableComments.length})</summary>\n\n`;
  for (const comment of actionableComments) {
    body += `- <details>\n`;
    body += `  <summary>${comment.file} [${comment.start_line}-${comment.end_line}]</summary>\n\n`;
    body += `  > ${comment.label}: "${comment.header}"\n`;
    body += `  </details>\n`;
  }
  body += "\n</details>\n\n";

  // Skipped comments section
  body += `<details>\n<summary>Skipped Comments (${skippedComments.length})</summary>\n\n`;
  for (const comment of skippedComments) {
    body += `- <details>\n`;
    body += `  <summary>${comment.file} [${comment.start_line}-${comment.end_line}]</summary>\n\n`;
    body += `  > ${comment.label}: "${comment.header}"\n`;
    body += `  </details>\n`;
  }
  body += "</details>\n\n";

  return body;
}
