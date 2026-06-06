export default function SafetyFooter() {
  return (
    <footer
      className="relative mt-24 pt-16 pb-12 px-4"
      aria-label="Mental health support resources"
    >
      {/* Gradient fade separator */}
      <div
        className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#0E0E1A]/50"
        aria-hidden="true"
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="text-2xl font-bold text-[#F1F5F9] mb-6">
          You don&apos;t have to face this alone{' '}
          <span role="img" aria-label="blue heart">💙</span>
        </h2>

        <p className="text-[#94A3B8] mb-8">
          If you&apos;re going through a tough time, please reach out to a
          trained professional. These helplines are free, confidential, and
          available for you.
        </p>

        <address className="not-italic space-y-4 mb-8">
          <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#F1F5F9]">
                iCall (TISS)
              </p>
              <p className="text-xs text-[#64748B]">
                Mon–Sat, 8am–10pm
              </p>
            </div>
            <a
              href="tel:9152987821"
              className="text-[#06B6D4] font-mono font-semibold hover:underline min-h-[44px] flex items-center"
              aria-label="Call iCall helpline at 9152987821"
            >
              9152987821
            </a>
          </div>

          <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#F1F5F9]">
                Vandrevala Foundation
              </p>
              <p className="text-xs text-[#64748B]">24/7 available</p>
            </div>
            <a
              href="tel:18002662345"
              className="text-[#06B6D4] font-mono font-semibold hover:underline min-h-[44px] flex items-center"
              aria-label="Call Vandrevala Foundation helpline at 1860-2662-345"
            >
              1860-2662-345
            </a>
          </div>

          <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#F1F5F9]">
                NIMHANS Helpline
              </p>
              <p className="text-xs text-[#64748B]">
                Bangalore-based
              </p>
            </div>
            <a
              href="tel:08046110007"
              className="text-[#06B6D4] font-mono font-semibold hover:underline min-h-[44px] flex items-center"
              aria-label="Call NIMHANS helpline at 080-46110007"
            >
              080-46110007
            </a>
          </div>

          <div className="glass-card p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-[#F1F5F9]">
                iCall WhatsApp
              </p>
              <p className="text-xs text-[#64748B]">Chat support</p>
            </div>
            <a
              href="tel:9152987821"
              className="text-[#06B6D4] font-mono font-semibold hover:underline min-h-[44px] flex items-center"
              aria-label="WhatsApp iCall at 9152987821"
            >
              9152987821
            </a>
          </div>
        </address>

        <div className="border-t border-white/5 pt-6">
          <p className="text-sm text-[#64748B] mb-4">
            MindCast is a self-reflection tool, not a substitute for
            professional mental health support.
          </p>
          <p className="text-lg font-medium text-[#94A3B8]">
            You are enough. One day at a time.{' '}
            <span role="img" aria-label="blue heart">💙</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
