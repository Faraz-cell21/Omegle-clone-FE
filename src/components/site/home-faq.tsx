const FAQ_ITEMS = [
  {
    question: "What is Chatot?",
    answer:
      "Chatot is a free anonymous text chat service. You are matched one-on-one with a stranger for a private conversation. You can add interest tags to find people with shared topics, or use global chat to meet anyone online.",
  },
  {
    question: "Do I need an account?",
    answer:
      "No. Chatot does not require sign-up, email, or a profile. Open the site, complete security verification, and start chatting.",
  },
  {
    question: "How does tag matching work?",
    answer:
      "Add one or more tags (for example gaming, music, or coding). We match you with someone who shares at least one of your tags. Global chat skips tags and pairs you with any available user.",
  },
  {
    question: "Is Chatot safe?",
    answer:
      "We use community guidelines, rate limits, CAPTCHA, and temporary bans for abuse. Never share personal details in chat. You must be 18 or older. Leave or skip anytime if a conversation feels uncomfortable.",
  },
  {
    question: "Can I skip to someone new?",
    answer:
      "Yes. During a chat you can skip to find a new partner. You can also return home and start a new global or tag-based session.",
  },
] as const;

export function HomeFaq() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="mb-8 lg:mb-10 mx-auto max-w-3xl"
    >
      <h2
        id="faq-heading"
        className="text-xl lg:text-2xl font-semibold text-center mb-6"
      >
        Frequently asked questions
      </h2>
      <dl className="space-y-3">
        {FAQ_ITEMS.map((item) => (
          <div
            key={item.question}
            className="rounded-xl border bg-card px-4 py-4 sm:px-5"
          >
            <dt className="text-sm sm:text-base font-medium text-foreground">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
