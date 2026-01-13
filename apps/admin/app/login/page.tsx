import { LoginForm } from "@/components/login-form";
import { LoginMarquee } from "@/components/login-marquee";
import { worksApi, portfolioApi } from "@/lib/api";

export default async function LoginPage() {
  const works = await worksApi.getAll().catch(() => []);
  const portfolios = await portfolioApi.getAll().catch(() => []);

  const workImages = works
    .flatMap((w) => w.content.flatMap((c) => c.images))
    .filter((img) => img && img.startsWith("http"));

  const portfolioImages = portfolios
    .flatMap((p) => p.images)
    .filter((img) => img && img.startsWith("http"));

  const allImages = [...workImages, ...portfolioImages];

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Left Column - Branding */}
      <div className="hidden bg-zinc-900 lg:flex flex-col items-center justify-center relative overflow-hidden text-white dark:border-r">
        <LoginMarquee images={allImages} />
        <div className="relative z-20 flex flex-col items-center gap-6 text-center">
          <img
            src="/assets/identity/logo.png"
            alt="Mutualist"
            className="h-20 w-20 object-contain"
          />
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Mutualist Admin
            </h1>
            <p className="text-zinc-400 text-lg">
              Manage your creative portfolio.
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto w-[350px] space-y-6">
          <div className="flex flex-col space-y-2 text-center">
            {/* Mobile Logo shown only on small screens */}
            <div className="flex justify-center lg:hidden mb-4">
              <img
                src="/assets/identity/logo.png"
                alt="Mutualist"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
