import { info, warning } from "@actions/core";
import { loadContext } from "./context";
import config from "./config";
import { initOctokit } from "./octokit";
import { COMMENT_SIGNATURE } from "./messages";

export async function handlePullRequestComment() {
  const context = await loadContext();
  if (context.eventName !== "pull_request_review_comment") {
    warning("unsupported github event");
    return;
  }

  const { comment, pull_request } = context.payload;
  if (!comment) {
    warning("`comment` is missing from payload");
    return;
  }
  if (context.payload.action !== "created") {
    warning("only consider newly created comments");
    return;
  }
  if (!pull_request) {
    warning("`pull_request` is missing from payload");
    return;
  }
  if (isOwnComment(comment.body)) {
    info("ignoring own comments");
    return;
  }

  // TODO: implement
}

function isOwnComment(comment: string): boolean {
  return comment.includes(COMMENT_SIGNATURE);
}
