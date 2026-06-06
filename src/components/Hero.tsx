import HeroOrbs from '@/components/HeroOrbs';
import HeroWeatherDisplay from '@/components/HeroWeatherDisplay';

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      aria-label="Welcome to MindCast"
    >
      <HeroOrbs />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent animate-gradient-text">
            Your Exam Weather Report
          </span>
        </h1>

        <p className="text-lg md:text-xl text-[#64748B] mb-10 max-w-2xl mx-auto">
          Track your mind. Navigate the storm. Find your calm.
        </p>

        <HeroWeatherDisplay />

        <div
          className="mt-16 animate-bounce-gentle"
          aria-hidden="true"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </div>
      </div>
    </section>
  );
}
