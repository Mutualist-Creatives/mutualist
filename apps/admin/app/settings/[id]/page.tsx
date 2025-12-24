export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SettingsPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <div className="border p-4 rounded-lg bg-card">
        <p className="text-muted-foreground">
          Settings for user {id} will be implemented here.
        </p>
      </div>
    </div>
  );
}
