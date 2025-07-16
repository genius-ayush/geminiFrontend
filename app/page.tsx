import Landing from "@/components/Landing/landing";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-gray-900">
      <Landing/>
    </div>
  );
}
