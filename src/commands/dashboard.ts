export async function runDashboard(opts: { port?: number; host?: string }): Promise<void> {
  const port = opts.port ?? 3456;
  const host = opts.host ?? "0.0.0.0";

  // Dynamic import from dashboard's compiled server
  const { createServer } = await import("../../dashboard/server/index.js");
  await createServer({ port, host });
}
