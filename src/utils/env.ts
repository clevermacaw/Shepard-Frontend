declare global {
  interface Window {
    configs?: { [key: string]: string };
  }
}

export default function getEnv(name: string): string {
  if (!window.configs) return process.env[name];
  return window.configs[name] || process.env[name];
}
