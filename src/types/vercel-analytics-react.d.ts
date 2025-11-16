declare module "@vercel/analytics/react" {
  import type { ComponentType } from "react";

  export const Analytics: ComponentType<Record<string, never>>;
  export default Analytics;
}
