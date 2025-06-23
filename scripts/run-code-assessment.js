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

  const result = await agent.execute("Please analyze the Bitcoin UI repository at https://github.com/bitcoin-ui-kit/bitcoin-ui and provide a comprehensive code assessment report.")
  console.log("result", result)
  console.log("result.result", result.result)

  const parsedResult = typeof result.result === "string" ? JSON.parse(result.result) : result.result
  console.log("prDiff", parsedResult.prDiff)

  const patchUrl = parsedResult.prDiff?.url
  const reportUrl = parsedResult.reportUrl

  console.log("Patch URL:", patchUrl)
  console.log("Report URL:", reportUrl)
  // Test patch
  // const patchUrl = "https://signschool.s3.us-east-1.amazonaws.com/openagentic/websites/code-assessment-diff-bitcoin-ui-kit-bitcoin-ui-2025-06-23T15-11-18-658Z.txt"
  // const reportUrl = "https://signschool.s3.us-east-1.amazonaws.com/openagentic/websites/page_code-assessment-bitcoin-ui-kit-bitcoin-ui_2025-06-23_15-11-18-830_eayxzj.html"

  if (!patchUrl) {
    console.warn("No patch URL found in assessment result")
    return {
      patchUrl: null,
      hadChanges: false,
      prBody: `### 🧹 Automated code assessment\nNo patch URL found in assessment result.\nReport: ${reportUrl}\n`,
    }
  }

  // Verify the patch URL is accessible
  try {
    console.log("Verifying patch URL accessibility:", patchUrl)
    const response = await fetch(patchUrl, { method: "HEAD" })
    if (!response.ok) {
      throw new Error(`Failed to access patch: ${response.status} ${response.statusText}`)
    }
    console.log("Patch URL is accessible")
  } catch (error) {
    console.error("Error accessing patch URL:", error)
    return {
      patchUrl: null,
      hadChanges: false,
      prBody: `### 🧹 Automated code assessment\nFailed to access patch URL: ${patchUrl}\nError: ${error.message}\nReport: ${reportUrl}\n`,
    }
  }

  return {
    patchUrl,
    hadChanges: true,
    prBody: `### 🧹 Automated code assessment\nApply changes from the following code assessment report:\n${reportUrl}\n`,
  }
}

/* ----------------------------- CI glue code ----------------------------- */

(async () => {
  try {
    const { patchUrl, hadChanges, prBody } = await runAssessment()

    // Write outputs to GitHub Actions environment file
    const githubOutput = process.env.GITHUB_OUTPUT

    if (githubOutput) {
      fs.appendFileSync(githubOutput, `hadChanges=${hadChanges}\n`)

      if (hadChanges && patchUrl) {
        console.log(`Patch URL available: ${patchUrl}`)
        fs.appendFileSync(githubOutput, `patchUrl=${patchUrl}\n`)
      }

      if (prBody) {
        fs.appendFileSync(githubOutput, `prBody<<EOF\n${prBody}\nEOF\n`)
      }
    } else {
      // Fallback for local testing
      console.log("hadChanges:", hadChanges)
      if (hadChanges && patchUrl) {
        console.log("Patch URL:", patchUrl)
      }
      if (prBody) {
        console.log("prBody:", prBody)
      }
    }
  } catch (error) {
    console.error("Assessment failed:", error)
    process.exit(1)
  }
})()
