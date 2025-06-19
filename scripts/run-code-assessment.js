// scripts/run-assessment.js
// Mock version for local testing & CI dry-runs

/**
 * Pretend AI assessment that always returns:
 *  • one diff (README cleanup)
 *  • a short, friendly PR body
 */
async function runAssessment() {
    const patch = `
  diff --git a/README.md b/README.md
  @@ -538,1 +538,0 @@
  - - [Component Examples](src/example.tsx)
  `;
  
    return {
      changes: [{ path: 'README.md', patch }],
      hadChanges: true,
      prBody: `### 🧹 Automated README cleanup\nRemoved a dead link to \`src/example.tsx\` that no longer exists.\n`
    };
  }
  
  /* ----------------------------- CI glue code ----------------------------- */
  
  (async () => {
    const { changes, hadChanges, prBody } = await runAssessment();
  
    // Concatenate all patches (only one here) and escape newlines for GitHub Actions
    if (hadChanges) {
      const patchString = changes.map(c => c.patch).join('\n')
                                 .replace(/\r?\n/g, '%0A');
      console.log(`::set-output name=patchString::${patchString}`);
    }
  
    console.log(`::set-output name=hadChanges::${hadChanges}`);
  
    if (prBody) {
      const bodyEscaped = prBody.replace(/\r?\n/g, '%0A');
      console.log(`::set-output name=prBody::${bodyEscaped}`);
    }
})();
