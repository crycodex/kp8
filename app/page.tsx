import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="flex max-w-lg flex-col items-center gap-8 text-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Projects Dashboard
          </h1>
          <p className="mt-3 text-(--muted)">
            Manage your projects, track status, and collaborate with clients.
          </p>
        </div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-lg bg-(--accent) px-6 py-3 text-base font-medium text-white transition-colors hover:bg-(--accent-hover)"
        >
          View projects →
        </Link>
      </main>
    </div>
  );
}
