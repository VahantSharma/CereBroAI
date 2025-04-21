import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import TumorDetailSection from "@/components/TumorDetailSection";

const TumorTypes = () => {
  const tumorTypes = [
    {
      id: "skull-base",
      title: "Skull Base Tumors",
      description:
        "Skull base tumors are abnormal cell growths that can develop in the tissues around the brain. These tumors can be benign (non-cancerous) or malignant (cancerous) and may develop in the bones of the skull base or in nearby tissues. They can affect various critical structures, including nerves, blood vessels, and the brain itself, leading to a wide range of symptoms depending on their location and size.",
      symptoms: [
        "Headaches that worsen over time",
        "Vision problems including double vision",
        "Hearing loss or ringing in the ears",
        "Facial numbness or weakness",
        "Difficulty swallowing",
        "Balance problems or dizziness",
      ],
      treatments: [
        "Surgery to remove the tumor",
        "Radiation therapy to target cancer cells",
        "Stereotactic radiosurgery for precise treatment",
        "Chemotherapy for certain types of malignant tumors",
        "Observation for slow-growing tumors",
        "Supportive care to manage symptoms",
      ],
      images: ["/lovable-uploads/95c3e0ed-8e22-4682-a96c-2a21629010eb.png"],
      learnMoreUrl:
        "https://www.mayoclinic.org/diseases-conditions/brain-tumor/symptoms-causes/syc-20350084",
    },
    {
      id: "meningioma",
      title: "Meningiomas",
      description:
        "A meningioma is a tumor that grows in the membranes that cover the brain and spinal cord. Most meningiomas are noncancerous (benign), though rarely a meningioma may be cancerous (malignant). Some meningiomas grow slowly, and you may not need immediate treatment other than monitoring. Other meningiomas grow more rapidly, potentially causing serious complications as they press against the brain or spinal cord.",
      symptoms: [
        "Headaches that worsen in the morning",
        "Seizures",
        "Vision problems",
        "Memory loss",
        "Weakness in limbs",
        "Language difficulty",
      ],
      treatments: [
        "Observation for slow-growing tumors",
        "Surgical removal",
        "Radiation therapy",
        "Radiosurgery",
        "Medications to reduce symptoms",
        "Regular imaging to monitor growth",
      ],
      images: ["/lovable-uploads/45448ee1-3600-4145-808d-a788fdd8541e.png"],
      learnMoreUrl:
        "https://www.mayoclinic.org/diseases-conditions/meningioma/symptoms-causes/syc-20355643",
    },
    {
      id: "glioma",
      title: "Gliomas",
      description:
        "Gliomas are tumors that grow in the brain or spinal cord, starting in the glial cells. These cells support nerve cells, helping them function properly. Gliomas are one of the most common types of primary brain tumors, meaning they originate in the brain rather than spreading from another part of the body. They can be low-grade (slow-growing) or high-grade (fast-growing), and their treatment and prognosis vary accordingly.",
      symptoms: [
        "Progressive headaches",
        "Nausea and vomiting",
        "Seizures",
        "Memory loss",
        "Changes in personality or behavior",
        "Difficulty with balance and coordination",
      ],
      treatments: [
        "Surgery to remove as much of the tumor as possible",
        "Radiation therapy",
        "Chemotherapy",
        "Targeted drug therapy",
        "Tumor treating fields therapy",
        "Clinical trials for new treatments",
      ],
      images: ["/lovable-uploads/b5069690-0c5f-48d4-b581-0f0c4ffdd730.png"],
      learnMoreUrl:
        "https://www.mayoclinic.org/diseases-conditions/glioma/symptoms-causes/syc-20350251",
    },
    {
      id: "pituitary",
      title: "Pituitary Tumors",
      description:
        "A pituitary tumor is an abnormal growth of cells in the pituitary gland, a small gland at the base of the brain. The pituitary gland produces hormones that regulate many bodily functions. Most pituitary tumors are benign (adenomas) and don't spread beyond the pituitary gland. However, they can still cause serious health problems by producing excess hormones or by pressing on the optic nerves or brain tissue.",
      symptoms: [
        "Headaches",
        "Vision changes, particularly loss of peripheral vision",
        "Unexpected weight gain or loss",
        "Fatigue",
        "Changes in menstruation in women",
        "Erectile dysfunction in men",
      ],
      treatments: [
        "Medication to control hormone production",
        "Transsphenoidal surgery through the nasal cavity",
        "Radiation therapy",
        "Radiosurgery for smaller tumors",
        "Hormone replacement therapy",
        "Regular monitoring of hormone levels",
      ],
      images: ["/lovable-uploads/67e6833e-5bad-4871-a519-c49e8cf4ea18.png"],
      learnMoreUrl:
        "https://www.mayoclinic.org/diseases-conditions/pituitary-tumors/symptoms-causes/syc-20350548",
    },
    {
      id: "no-tumor",
      title: "No Tumor (Normal Brain Imaging)",
      description:
        "Normal brain imaging shows the typical structure of the brain without any abnormal growths or masses. Understanding what normal brain tissue looks like on various imaging modalities is essential for radiologists and neurologists to accurately identify abnormalities when they are present. Normal brain images serve as a baseline for comparison when evaluating potential pathological conditions.",
      symptoms: [
        "No tumor-related symptoms",
        "Normal neurological function",
        "Absence of unexplained headaches",
        "No seizures of unknown origin",
        "Normal vision",
        "Normal balance and coordination",
      ],
      treatments: [
        "Regular health check-ups as recommended",
        "Healthy lifestyle choices",
        "Brain-healthy diet",
        "Regular exercise",
        "Adequate sleep",
        "Stress management techniques",
      ],
      images: ["/lovable-uploads/d66e0df9-0bf7-4437-b8a7-ddf325e37a7b.png"],
      learnMoreUrl: "https://www.radiologyinfo.org/en/info/headmr",
    },
  ];

  return (
    <div className="min-h-screen bg-cerebro-darker text-white">
      <Navbar />

      <main className="pt-24">
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h1 className="heading-lg mb-6 text-center">Brain Tumor Types</h1>
            <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto">
              Learn about different types of brain tumors, their
              characteristics, symptoms, and treatment options.
            </p>
          </div>
        </section>

        {tumorTypes.map((tumorType) => (
          <TumorDetailSection
            key={tumorType.id}
            id={tumorType.id}
            title={tumorType.title}
            description={tumorType.description}
            images={tumorType.images}
            learnMoreUrl={tumorType.learnMoreUrl}
            symptoms={tumorType.symptoms}
            treatments={tumorType.treatments}
          />
        ))}
      </main>

      <Footer />

      {/* Chatbot Integration */}
      <ChatBot />
    </div>
  );
};

export default TumorTypes;
