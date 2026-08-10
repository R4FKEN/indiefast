# Agent instructions — indiefast

## Git worktrees: NEVER

**Do not use git worktrees for this project. Ever.**

- Never run `git worktree add`, `git worktree remove`, `git worktree prune`, or any worktree workflow.
- Never spawn subagents or tools with `isolation: "worktree"`.
- Never create parallel checkouts under a worktree path for implementation, review, or PR work.

**Only work in this local repository:**

`C:\Users\rafva\Documents\GitHub\indiefast`

All edits, commits, builds, and deploys happen in this Documents checkout on the current branch. No exceptions unless the user explicitly overrides this rule in writing for a single task.
