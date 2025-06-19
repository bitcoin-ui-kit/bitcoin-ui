// scripts/run-assessment.js
// Mock version for local testing & CI dry-runs

/**
 * Pretend AI assessment that always returns:
 *  • one diff (README cleanup)
 *  • a short, friendly PR body
 */
async function runAssessment() {
  const patch = `diff --git a/README.md b/README.md
index 1234567..abcdefg 100644
--- a/README.md
+++ b/README.md
@@ -538,1 +538,0 @@
- - [Component Examples](src/example.tsx)`

  return {
    changes: [{ path: "README.md", patch }],
    hadChanges: true,
    prBody: `### 🧹 Automated README cleanup\nRemoved a dead link to \`src/example.tsx\` that no longer exists.\n`,
  }
}

/* ----------------------------- CI glue code ----------------------------- */

(async () => {
  const { changes, hadChanges, prBody } = await runAssessment()

  // Write outputs to GitHub Actions environment file
  const fs = require("node:fs")
  const process = require("node:process")
  const githubOutput = process.env.GITHUB_OUTPUT

  if (githubOutput) {
    // Concatenate all patches (only one here)
    if (hadChanges) {
      const patchString = changes.map(c => c.patch).join("\n")
      fs.appendFileSync(githubOutput, `patchString<<EOF\n${patchString}\nEOF\n`)
    }

    fs.appendFileSync(githubOutput, `hadChanges=${hadChanges}\n`)

    if (prBody) {
      fs.appendFileSync(githubOutput, `prBody<<EOF\n${prBody}\nEOF\n`)
    }
  } else {
    // Fallback for local testing
    console.log("hadChanges:", hadChanges)
    if (hadChanges) {
      console.log("patchString:", changes.map(c => c.patch).join("\n"))
    }
    if (prBody) {
      console.log("prBody:", prBody)
    }
  }
})()
