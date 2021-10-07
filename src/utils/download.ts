export function downloadFile(response: Blob, filename?: string): void {
  filename = filename || "shepard-file";
  const link = document.createElement("a");
  link.href = URL.createObjectURL(response);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
