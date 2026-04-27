import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DemoAccessCard } from "@/components/login/demo-access-card";
import { SectionHeading } from "@/components/layout/section-heading";
import { GoogleLoginCard } from "@/components/login/google-login-card";
import { translate } from "@/lib/i18n";
import { getLocale } from "@/lib/locale-server";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  const locale = await getLocale();
  const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr,0.9fr] lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <SectionHeading
          eyebrow={translate(locale, "login.eyebrow")}
          title={translate(locale, "login.title")}
          description={translate(locale, "login.description")}
        />
        <div className="mt-8">
          <GoogleLoginCard enabled={googleEnabled} />
        </div>
        <div className="mt-5">
          <DemoAccessCard />
        </div>
        {!googleEnabled ? <p className="mt-4 text-sm leading-7 text-flame">{translate(locale, "login.envWarning")}</p> : null}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <div className="text-xs uppercase tracking-[0.3em] text-flame">{translate(locale, "login.rules")}</div>
        <div className="mt-5 space-y-4 text-sm leading-8 text-slate-300">
          <p>{translate(locale, "login.rule1")}</p>
          <p>{translate(locale, "login.rule2")}</p>
          <p>{translate(locale, "login.rule3")}</p>
        </div>
      </div>
    </div>
  );
}
