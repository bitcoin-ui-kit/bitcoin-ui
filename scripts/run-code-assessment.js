// scripts/run-assessment.js
// Mock version for local testing & CI dry-runs

import fs from "node:fs"
import process from "node:process"

/**
 * Clean and validate a git patch to ensure it can be applied successfully
 */
function cleanPatch(patch) {
  if (!patch || typeof patch !== "string") {
    console.warn("Invalid patch content:", typeof patch)
    return null
  }

  try {
    console.log("Raw patch input preview:", patch.substring(0, 500))

    // Remove markdown code fences and language identifiers
    let cleanedPatch = patch
      .replace(/^```\w*\s*\n/m, "") // Remove opening code fence with optional language
      .replace(/\n```\s*$/m, "") // Remove closing code fence
      .trim()

    // Split into lines for processing
    const lines = cleanedPatch.split("\n")

    // Remove trailing whitespace from each line
    const cleanedLines = lines.map(line => line.trimEnd())

    // Join back together
    cleanedPatch = cleanedLines.join("\n")

    // Ensure the patch ends with a newline
    if (!cleanedPatch.endsWith("\n")) {
      cleanedPatch += "\n"
    }

    // Basic validation - check if it looks like a valid git patch
    const hasGitHeader = cleanedPatch.includes("diff --git")
    const hasHunkHeader = cleanedPatch.includes("@@")

    if (!hasGitHeader && !hasHunkHeader) {
      console.warn("Patch does not appear to be a valid git diff format")
      return null
    }

    // Check for incomplete patches (common issue)
    const diffHeaders = cleanedPatch.match(/diff --git/g) || []
    const fileHeaders = cleanedPatch.match(/^---|\+\+\+/gm) || []

    if (diffHeaders.length > 0 && fileHeaders.length < diffHeaders.length * 2) {
      console.warn("Patch appears to be incomplete (missing file headers)")
      return null
    }

    // Check for truncation by looking for incomplete lines
    const lastLine = cleanedLines[cleanedLines.length - 1]
    if (lastLine && !lastLine.match(/^[@ +-]/) && lastLine.length > 0 && !lastLine.includes("\\")) {
      console.warn("Patch appears to be truncated (incomplete last line):", lastLine)
      return null
    }

    console.log("Patch validated and cleaned successfully")
    console.log(`Patch size: ${cleanedPatch.length} characters, ${lines.length} lines`)
    console.log(`Cleaned patch preview (first 500 chars):\n${cleanedPatch.substring(0, 500)}...`)

    return cleanedPatch
  } catch (error) {
    console.error("Error cleaning patch:", error)
    return null
  }
}

/**
 * Pretend AI assessment that always returns:
 *  • one diff (README cleanup)
 *  • a short, friendly PR body
 */
async function runAssessment() {
  // const agent = createAgent({
  //   model: "gpt-4o-mini", // Use consistent model for testing
  //   orchestrator: "code_assessment",
  //   orchestratorParams: {
  //     additionalPaths: ["src/components", "src/components/__tests__"],
  //     provideDiff: true,
  //   },
  //   tools: [githubTool, anthropicTool, geminiTool, openaiTool],
  //   enableDebugLogging: true,
  //   logLevel: "basic",
  //   maxIterations: 15, // Allow more iterations for complex orchestrators
  // })

  // const result = await agent.execute("Please analyze the Bitcoin UI repository at https://github.com/bitcoin-ui-kit/bitcoin-ui and provide a comprehensive code assessment report.")
  // console.log("result", result)
  // console.log("result.result", result.result)

  // const parsedResult = typeof result.result === "string" ? JSON.parse(result.result) : result.result
  // console.log("prDiff", parsedResult.prDiff)

  // const patchUrl = parsedResult.prDiff?.url
  // const reportUrl = parsedResult.reportUrl

  // console.log("Patch URL:", patchUrl)
  // console.log("Report URL:", reportUrl)
  const patchUrl = "https://signschool.s3.us-east-1.amazonaws.com/openagentic/websites/code-assessment-diff-bitcoin-ui-kit-bitcoin-ui-2025-06-23T15-11-18-658Z.txt"
  const reportUrl = "https://signschool.s3.us-east-1.amazonaws.com/openagentic/websites/page_code-assessment-bitcoin-ui-kit-bitcoin-ui_2025-06-23_15-11-18-830_eayxzj.html"

  let rawPatch = null
  if (patchUrl) {
    try {
      console.log("Fetching patch from URL:", patchUrl)
      const response = await fetch(patchUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch patch: ${response.status} ${response.statusText}`)
      }
      rawPatch = await response.text()
      console.log("Successfully fetched patch content")
      console.log("Raw patch content preview:", rawPatch.substring(0, 500))
    } catch (error) {
      console.error("Error fetching patch from URL:", error)
      return {
        patch: null,
        hadChanges: false,
        prBody: `### 🧹 Automated code assessment\nFailed to fetch patch from URL: ${patchUrl}\nError: ${error.message}\nReport: ${reportUrl}\n`,
      }
    }
  } else {
    console.warn("No patch URL found in assessment result")
    return {
      patch: null,
      hadChanges: false,
      prBody: `### 🧹 Automated code assessment\nNo patch URL found in assessment result.\nReport: ${reportUrl}\n`,
    }
  }

  // Clean and validate the patch
  const cleanedPatch = cleanPatch(rawPatch)

  if (!cleanedPatch) {
    console.warn("No valid patch generated or patch failed validation")
    return {
      patch: null,
      hadChanges: false,
      prBody: `### 🧹 Automated code assessment\nCode assessment completed but no valid changes were generated.\nReport: ${reportUrl}\n`,
    }
  }

  return {
    patch: cleanedPatch,
    hadChanges: true,
    prBody: `### 🧹 Automated code assessment\nApply changes from the following code assessment report:\n${reportUrl}\n`,
  }
}

/* ----------------------------- CI glue code ----------------------------- */

(async () => {
  try {
    const { patch, hadChanges, prBody } = await runAssessment()

    // Write outputs to GitHub Actions environment file
    const githubOutput = process.env.GITHUB_OUTPUT

    if (githubOutput) {
      fs.appendFileSync(githubOutput, `hadChanges=${hadChanges}\n`)

      // Always write patch to file for consistency and reliability
      if (hadChanges && patch) {
        console.log(`Writing patch to file (${patch.length} chars)`)
        fs.writeFileSync("/tmp/assessment.patch", patch)
        fs.appendFileSync(githubOutput, `patchFile=/tmp/assessment.patch\n`)
      }

      if (prBody) {
        fs.appendFileSync(githubOutput, `prBody<<EOF\n${prBody}\nEOF\n`)
      }
    } else {
      // Fallback for local testing
      console.log("hadChanges:", hadChanges)
      if (hadChanges && patch) {
        console.log(`Writing patch to file for local testing (${patch.length} chars)`)
        fs.writeFileSync("/tmp/assessment.patch", patch)
        console.log("Patch written to: /tmp/assessment.patch")
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
