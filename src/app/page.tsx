import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Shortcut from "@/components/Shortcut";
import MainContent from "@/components/MainContent";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { ModalProvider } from "@/components/modals/ModalContext";
import ModalRoot from "@/components/modals/ModalRoot";

export default function Home() {
  return (
    <ModalProvider>
      <Header />
      <main id="main">
        <Hero />
        <Shortcut />
        <MainContent />
        <Banner />
      </main>
      <Footer />
      <ModalRoot />
    </ModalProvider>
  );
}
