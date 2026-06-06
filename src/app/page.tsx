import Hero from '@/components/Hero';
import SafetyFooter from '@/components/SafetyFooter';
import DashboardContent from '@/components/DashboardContent';

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <DashboardContent />
      <SafetyFooter />
    </main>
  );
}
