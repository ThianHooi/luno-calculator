import LunoInvestmentCalculator from "@/components/LunoInvestmentCalculator";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <LunoInvestmentCalculator />
      <Footer />
    </div>
  );
}
