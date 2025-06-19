// scripts/run-assessment.js
// Mock version for local testing & CI dry-runs

import fs from "node:fs"
import process from "node:process"

/**
 * Pretend AI assessment that always returns:
 *  • one diff (README cleanup)
 *  • a short, friendly PR body
 */
async function runAssessment() {
  const patchLines = [
    "diff --git a/README.md b/README.md",
    "--- a/README.md",
    "+++ b/README.md",
    "@@ -535,5 +535,4 @@ MIT © [Bitcoin UI](LICENSE)",
    " - [Bitcoin Design Guide](https://bitcoin.design/guide/)",
    " - [Bitcoin Universal Design Accessibility Standards](https://jason-me.github.io/bitcoin-universal-design/)",
    " - [GitHub Repository](https://github.com/bitcoin-ui/bitcoin-ui)",
    "-- [Component Examples](src/example.tsx)",
    " - [Contributing Guidelines](CONTRIBUTING.md)",
  ]
  const patch = patchLines.join("\n")

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
