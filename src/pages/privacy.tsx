import { SiteLayout } from "~/components/site/site-layout";
import { usePageMeta } from "~/hooks/use-page-meta";

export default function PrivacyPage() {
  usePageMeta(
    "Privacy Policy | Chatot",
    "How Chatot handles anonymity, data, and safety for anonymous tag-based chat.",
  );

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground text-sm">Last updated: May 2026</p>

        <section className="mt-8 space-y-4 text-foreground/90 leading-relaxed">
          <h2 className="text-xl font-medium text-foreground">Overview</h2>
          <p>
            Chatot provides anonymous one-on-one text chat. We collect only what is
            needed to operate the service, prevent abuse, and keep the platform safe.
          </p>

          <h2 className="text-xl font-medium text-foreground">What we collect</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Technical data:</strong> IP address, browser type, and
              connection timestamps for moderation, rate limits, and security
              (including CAPTCHA verification).
            </li>
            <li>
              <strong>Chat session data:</strong> Messages may be stored temporarily
              in memory or short-term storage to deliver chat and handle reports.
            </li>
            <li>
              <strong>Tags you choose:</strong> Interest tags used only for
              matchmaking, not a public profile.
            </li>
          </ul>
          <p>
            We do not require accounts, real names, email, or phone numbers to use
            the public chat experience.
          </p>

          <h2 className="text-xl font-medium text-foreground">How we use data</h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Match you with other users and deliver messages</li>
            <li>Enforce community guidelines and temporary bans</li>
            <li>Protect against bots, spam, and abuse</li>
            <li>Operate and improve the service</li>
          </ul>

          <h2 className="text-xl font-medium text-foreground">Retention</h2>
          <p>
            Session and moderation data are kept only as long as needed for
            operations and safety, then removed or aggregated. Temporary IP bans
            expire automatically after the stated ban period.
          </p>

          <h2 className="text-xl font-medium text-foreground">Sharing</h2>
          <p>
            We do not sell your personal information. We may share data when required
            by law or to protect users and the service.
          </p>

          <h2 className="text-xl font-medium text-foreground">Your choices</h2>
          <p>
            Do not share personal details in chat. You can leave a conversation at
            any time. Users who break our rules may be temporarily restricted.
          </p>

          <h2 className="text-xl font-medium text-foreground">Contact</h2>
          <p>
            For privacy questions, contact the operator of this site through the
            support channel listed on the homepage when available.
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
