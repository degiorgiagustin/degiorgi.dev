// PostToolUse(Bash) hook: when the command that just ran created a GitHub PR,
// instruct the session to launch the frontend-code-reviewer agent. The filter
// lives here (not in a settings `if` rule) so compound commands like
// `cd repo && gh pr create ...` still match.
let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let command = "";
  try {
    command = JSON.parse(raw).tool_input?.command ?? "";
  } catch {
    return; // malformed input: stay silent, never break the tool flow
  }
  // `gh pr create` at command start or right after a shell separator — avoids
  // false positives on the phrase appearing inside strings/heredocs.
  if (!/(^|[;&|()]\s*)gh\s+pr\s+create\b/m.test(command)) return;
  console.log(
    JSON.stringify({
      systemMessage: "PR detected — frontend-code-reviewer requested.",
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext:
          "A pull request was just created. Per this repository's review policy, launch the frontend-code-reviewer agent now (Agent tool, subagent_type: \"frontend-code-reviewer\"), passing the PR number/branch and base branch as context. Wait for its report and relay the findings to the user ranked by severity, including the 'Verified clean' section.",
      },
    }),
  );
});
