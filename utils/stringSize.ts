/**
 * Returns the size of a string, formating it to be human-readable. e.g. 2.5 MB
 */
export default function stringSize(string: string): string {
  const bytes = new Blob([string]).size;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
