export function Analytics(): JSX.Element | null {
  if (import.meta.env.DEV) {
    console.warn("@vercel/analytics/react is not installed; Analytics component is a no-op fallback.");
  }
  return null;
}

export default Analytics;
