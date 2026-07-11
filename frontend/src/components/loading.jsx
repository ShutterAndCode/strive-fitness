import { Loader2Icon } from "lucide-react";

const loading = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Loader2Icon className="h-8 w-8 animate-spin" />
    </div>
  );
};

export default loading;
