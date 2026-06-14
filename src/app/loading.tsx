import { Loader } from "@/components/shared/Loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Loader size="lg" />
    </div>
  );
}
