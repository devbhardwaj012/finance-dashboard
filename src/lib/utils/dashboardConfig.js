/**
 * exportDashboardConfig
 *
 * Exports the current dashboard configuration to a downloadable JSON file.
 *
 * Responsibilities:
 * - Capture widget state and theme preference
 * - Attach versioning metadata for forward compatibility
 * - Trigger a client-side file download
 *
 * The exported file can later be imported to restore the dashboard.
 */
export function exportDashboardConfig({ widgets, theme }) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    dashboard: {
      widgets,
      theme,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-backup-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * importDashboardConfig
 *
 * Imports a previously exported dashboard configuration file.
 *
 * Responsibilities:
 * - Read and parse the JSON file
 * - Validate the expected structure and version
 * - Return dashboard data for state restoration
 *
 * Throws an error if the file format is invalid.
 */
export async function importDashboardConfig(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!parsed.version || !parsed.dashboard?.widgets) {
    throw new Error("Invalid dashboard configuration file");
  }

  return parsed.dashboard;
}
