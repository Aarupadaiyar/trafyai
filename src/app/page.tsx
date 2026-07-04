import { redirect } from "next/navigation";

// In the real Trafy monorepo this route doesn't exist — this project mounts
// under the existing site at /intelligence. This file is only here so
// `next dev` has something to show at `/` during standalone development.
export default function RootPage() {
  redirect("/intelligence");
}
