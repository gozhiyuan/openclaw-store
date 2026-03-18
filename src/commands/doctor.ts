import { runChecks } from "../lib/doctor.js";

export async function runDoctor(autoFix: boolean = false): Promise<void> {
  const findings = await runChecks();

  // Print results
  console.log("\nmalaclaw doctor\n");
  let hasErrors = false;
  let hasWarnings = false;

  for (const f of findings) {
    const icon = f.severity === "ok" ? "✓" : f.severity === "warning" ? "⚠" : "✗";
    console.log(`  ${icon} ${f.message}`);
    if (f.fix && f.severity !== "ok") {
      console.log(`    → ${f.fix}`);
    }
    if (f.severity === "error") hasErrors = true;
    if (f.severity === "warning") hasWarnings = true;
  }

  console.log("");
  if (hasErrors) {
    console.log("✗ Errors found. Run with --fix or follow the suggestions above.");
    process.exit(1);
  } else if (hasWarnings) {
    console.log("⚠ Warnings found. Check suggestions above.");
  } else {
    console.log("✓ All checks passed.");
  }
}
