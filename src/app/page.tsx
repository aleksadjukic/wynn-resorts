import RegistrationForm from "@/components/features/registration-form/RegistrationForm";
import Header from "@/components/layout/Header/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-2xs">
      <Header/>

      <main>
        <RegistrationForm />
      </main>
    </div>
  );
}
