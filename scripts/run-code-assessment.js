// scripts/run-assessment.js
// Mock version for local testing & CI dry-runs

import fs from "node:fs"
import process from "node:process"

import { anthropicTool, createAgent, geminiTool, githubTool, openaiTool } from "openagentic"

/**
 * Pretend AI assessment that always returns:
 *  • one diff (README cleanup)
 *  • a short, friendly PR body
 */
async function runAssessment() {
  const agent = createAgent({
    model: "gpt-4o-mini", // Use consistent model for testing
    orchestrator: "code_assessment",
    orchestratorParams: {
      additionalPaths: ["src/components", "src/components/__tests__"],
      provideDiff: true,
    },
    tools: [githubTool, anthropicTool, geminiTool, openaiTool],
    enableDebugLogging: true,
    logLevel: "basic",
    maxIterations: 15, // Allow more iterations for complex orchestrators
  })
  const result = await agent.run("Please analyze the Bitcoin UI repository at https://github.com/bitcoin-ui-kit/bitcoin-ui and provide a comprehensive code assessment report.")
  console.log("result", result)
  console.log("result.result", result.result)
  const parsedResult = typeof result.result === "string" ? JSON.parse(result.result) : result.result
  console.log("prDiff", parsedResult.prDiff)
  const patch2 = parsedResult.prDiff.content
  const reportUrl = parsedResult.reportUrl
  console.log("patch2", patch2)
  console.log("reportUrl", reportUrl)
  // const patchLines = [
  //   "diff --git a/README.md b/README.md",
  //   "--- a/README.md",
  //   "+++ b/README.md",
  //   "@@ -535,5 +535,4 @@ MIT © [Bitcoin UI](LICENSE)",
  //   " - [Bitcoin Design Guide](https://bitcoin.design/guide/)",
  //   " - [Bitcoin Universal Design Accessibility Standards](https://jason-me.github.io/bitcoin-universal-design/)",
  //   " - [GitHub Repository](https://github.com/bitcoin-ui/bitcoin-ui)",
  //   "-- [Component Examples](src/example.tsx)",
  //   " - [Contributing Guidelines](CONTRIBUTING.md)",
  // ]
  // const patch = patchLines.join("\n")

  return {
    // changes: [{ path: "README.md", patch }],
    patch: patch2,
    hadChanges: true,
    prBody: `### 🧹 Automated README cleanup\nRemoved a dead link to \`src/example.tsx\` that no longer exists.\n`,
  }
}

/* ----------------------------- CI glue code ----------------------------- */

(async () => {
  const { changes, patch, hadChanges, prBody } = await runAssessment()

  // Write outputs to GitHub Actions environment file
  const githubOutput = process.env.GITHUB_OUTPUT

  if (githubOutput) {
    // Concatenate all patches (only one here)
    if (hadChanges) {
      // const patchString = changes.map(c => c.patch).join("\n")
      // fs.appendFileSync(githubOutput, `patchString<<EOF\n${patchString}\nEOF\n`)
      fs.appendFileSync(githubOutput, `patchString<<EOF\n${patch}\nEOF\n`)
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
