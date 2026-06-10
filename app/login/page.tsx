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
    <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr,0.9fr] lg:px-8">
      <div className="rounded-[2rem] border border-white/10 bg-card/75 p-8">
        <SectionHeading
          eyebrow={translate(locale, "login.eyebrow")}
          title={translate(locale, "login.title")}
          description={translate(locale, "login.description")}
        />
        <div className="mt-8">
          <a
            href="/api/steam/login"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#ffffff]/5 bg-[#020204] p-4 text-xs font-heading font-bold uppercase tracking-wider text-white hover:border-[#ffffff]/10 hover:bg-[#05050a] transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="size-4">
              <path d="M.329 10.333A8.01 8.01 0 0 0 7.99 16C12.414 16 16 12.418 16 8s-3.586-8-8.009-8A8.006 8.006 0 0 0 0 7.468l.003.006 4.304 1.769A2.2 2.2 0 0 1 5.62 8.88l1.96-2.844-.001-.04a3.046 3.046 0 0 1 3.042-3.043 3.046 3.046 0 0 1 3.042 3.043 3.047 3.047 0 0 1-3.111 3.044l-2.804 2a2.223 2.223 0 0 1-3.075 2.11 2.22 2.22 0 0 1-1.312-1.568L.33 10.333Z"/>
              <path d="M4.868 12.683a1.715 1.715 0 0 0 1.318-3.165 1.7 1.7 0 0 0-1.263-.02l1.023.424a1.261 1.261 0 1 1-.97 2.33l-.99-.41a1.7 1.7 0 0 0 .882.84Zm3.726-6.687a2.03 2.03 0 0 0 2.027 2.029 2.03 2.03 0 0 0 2.027-2.029 2.03 2.03 0 0 0-2.027-2.027 2.03 2.03 0 0 0-2.027 2.027m2.03-1.527a1.524 1.524 0 1 1-.002 3.048 1.524 1.524 0 0 1 .002-3.048"/>
            </svg>
            Sign in with Steam
          </a>
        </div>
        <div className="mt-4">
          <GoogleLoginCard enabled={googleEnabled} />
        </div>
        <div className="mt-4">
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
