import ChatBot from "@/components/ChatBot";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-cerebro-darker text-white">
      <Navbar />

      <main className="pt-24">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="heading-lg mb-6 text-center">Connect With Us</h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              Have questions about our brain tumor detection technology? Want to
              collaborate? Get in touch with our team.
            </p>
          </div>
        </section>

        <ContactSection />
      </main>

      <Footer />

      {/* Chatbot Integration */}
      <ChatBot />
    </div>
  );
};

export default Contact;
