import ChatBot from "@/components/ChatBot";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";

const About = () => {
  const technologies = [
    "OpenCV",
    "EfficientNETB",
    "TensorFlow with Keras",
    "Adamax",
  ];

  const team = [
    {
      name: "Karan",
      role: "AI Developer & Data Scientist",
      bio: "Specializes in neural network architecture and medical image processing algorithms.",
    },
    {
      name: "Vahant",
      role: "Full-Stack Developer & UX Designer",
      bio: "Focuses on creating intuitive user interfaces and robust backend systems for medical applications.",
    },
  ];

  return (
    <div className="min-h-screen bg-cerebro-darker text-white">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-24 bg-cerebro-dark relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-40 right-10 w-72 h-72 bg-cerebro-accent/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-cerebro-secondary/10 rounded-full filter blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="heading-xl mb-6">About CereBro AI</h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                An AI-based medical imaging tool for detecting and classifying
                brain tumors with high accuracy. Using deep learning and
                advanced computer vision.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="heading-lg mb-6">Our Mission</h2>
                <div className="space-y-6 text-gray-300">
                  <p>
                    CereBro AI was founded with a clear mission: to
                    revolutionize brain tumor detection through artificial
                    intelligence, making accurate diagnosis more accessible and
                    efficient for healthcare providers worldwide.
                  </p>
                  <p>
                    By leveraging state-of-the-art deep learning algorithms, we
                    aim to reduce diagnostic time, minimize human error, and
                    ultimately improve patient outcomes in the field of
                    neuro-oncology.
                  </p>
                  <p>
                    We believe that combining medical expertise with advanced AI
                    capabilities can create tools that support healthcare
                    professionals in making more informed decisions and
                    providing better care for patients with brain tumors.
                  </p>
                </div>
              </div>

              <div className="bg-cerebro-dark p-8 rounded-2xl">
                <h3 className="text-2xl font-medium mb-6">
                  Technologies we are using
                </h3>
                <div className="space-y-6">
                  {technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-cerebro-darker p-4 rounded-lg text-center"
                    >
                      <h4 className="text-xl font-serif">{tech}</h4>
                    </div>
                  ))}
                  <div className="text-center text-gray-400 text-sm">
                    A product by Karan & Vahant
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-cerebro-dark">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="heading-lg mb-4">Meet Our Team</h2>
              <p className="text-lg text-gray-300">
                The minds behind CereBro AI - combining expertise in artificial
                intelligence, medical imaging, and software development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <Card
                  key={index}
                  className="bg-cerebro-darker border-white/10 p-8"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-cerebro-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-serif">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-medium mb-2">{member.name}</h3>
                    <p className="text-cerebro-accent mb-4">{member.role}</p>
                    <p className="text-gray-300">{member.bio}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      <Footer />

      {/* Chatbot Integration */}
      <ChatBot />
    </div>
  );
};

export default About;
