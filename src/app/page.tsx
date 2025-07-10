import Newsletter from "@/components/features/newsletter/Newsletter";
import RegistrationForm from "@/components/features/registration-form/RegistrationForm";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-2xs">
      <Header/>

      <main>
        <RegistrationForm />
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
