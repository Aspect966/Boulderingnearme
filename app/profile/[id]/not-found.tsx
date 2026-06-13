import Link from "next/link";

export default function ProfileNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-stone-900">Profile not found</h1>
      <p className="mt-2 text-sm text-stone-600">
        This climber does not exist or their profile is unavailable.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-amber-700 hover:underline"
      >
        Back to explore
      </Link>
    </div>
  );
}
