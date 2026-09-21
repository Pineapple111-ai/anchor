import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Shortcut from "@/components/Shortcut";
import MainContent from "@/components/MainContent";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Shortcut />
        <MainContent />
        <Banner />
      </main>
      <Footer />
    </>
  );
}
