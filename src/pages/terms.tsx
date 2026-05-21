import { SiteLayout } from "~/components/site/site-layout";
import { usePageMeta } from "~/hooks/use-page-meta";

export default function TermsPage() {
  usePageMeta(
    "Terms of Service | Chatot",
    "Rules for using Chatot anonymous chat — eligibility, conduct, and limitations.",
  );

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

        <section className="mt-8 space-y-4 text-foreground/90 leading-relaxed">
          <h2 className="text-xl font-medium text-foreground">Agreement</h2>
          <p>
            By using Chatot, you agree to these terms. If you do not agree, do not
            use the service.
          </p>

          <h2 className="text-xl font-medium text-foreground">Eligibility</h2>
          <p>
            You must be at least <strong>18 years old</strong> to use Chatot. The
            service is for adults only.
          </p>

          <h2 className="text-xl font-medium text-foreground">Acceptable use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Harass, threaten, or harm others</li>
            <li>Share sexual, illegal, or hateful content</li>
            <li>Request or share personal identifying information</li>
            <li>Spam, bot, or attempt to disrupt the service</li>
            <li>Evade bans, CAPTCHA, or rate limits</li>
          </ul>

          <h2 className="text-xl font-medium text-foreground">Anonymous chat</h2>
          <p>
            Conversations are with random strangers. We do not guarantee the
            behavior, identity, or intentions of other users. Use caution and stop
            chatting if you feel uncomfortable.
          </p>

          <h2 className="text-xl font-medium text-foreground">Moderation</h2>
          <p>
            We may monitor abuse signals, apply temporary IP restrictions, and
            remove access for violations. We are not obligated to provide advance
            notice.
          </p>

          <h2 className="text-xl font-medium text-foreground">Disclaimer</h2>
          <p>
            Chatot is provided &quot;as is&quot; without warranties. We are not
            liable for user-generated content or interactions between users, to the
            fullest extent permitted by law.
          </p>

          <h2 className="text-xl font-medium text-foreground">Changes</h2>
          <p>
            We may update these terms. Continued use after changes means you accept
            the updated terms.
          </p>
        </section>
      </article>
    </SiteLayout>
  );
}
