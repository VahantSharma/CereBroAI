import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import UploadAnalysis from "@/components/UploadAnalysis";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/auth";
import { format } from "date-fns";
import {
  ArrowRight,
  BrainCircuit,
  FileImage,
  HelpCircle,
  History,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

// Define the Analysis type
interface Analysis {
  id: string;
  result: string;
  confidence: number;
  status: "success" | "error" | "processing";
  imagePath: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("upload");
  const [analysisHistory, setAnalysisHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch analysis history when the history tab is activated
  useEffect(() => {
    if (activeTab === "history") {
      fetchAnalysisHistory();
    }
  }, [activeTab]);

  const fetchAnalysisHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/analysis/history");
      setAnalysisHistory(response.data.data.history || []);
    } catch (error) {
      console.error("Error fetching analysis history:", error);
      toast({
        title: "Error",
        description: "Failed to fetch analysis history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add the delete function
  const deleteAnalysis = async (id: string) => {
    try {
      const response = await api.delete(`/analysis/${id}`);
      if (response.status === 200) {
        // Remove the deleted analysis from the state
        setAnalysisHistory((prev) =>
          prev.filter((analysis) => analysis.id !== id)
        );
        toast({
          title: "Success",
          description: "Analysis deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting analysis:", error);
      toast({
        title: "Error",
        description: "Failed to delete analysis",
        variant: "destructive",
      });
    }
  };

  // The ProtectedRoute component will already handle authentication checking,
  // so we don't need to do it here again

  return (
    <div className="min-h-screen bg-cerebro-darker text-white">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h1 className="heading-lg mb-4">Dashboard</h1>
            <p className="text-gray-300">
              Welcome{user?.name ? `, ${user.name}` : ""} to your CereBro AI
              dashboard. Upload MRI scans for analysis or explore information
              about different tumor types.
            </p>
          </div>

          <Tabs
            defaultValue="upload"
            className="space-y-8"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="bg-cerebro-dark border border-white/10">
              <TabsTrigger
                value="upload"
                className="data-[state=active]:bg-cerebro-accent"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Upload & Analyze
              </TabsTrigger>
              <TabsTrigger
                value="information"
                className="data-[state=active]:bg-cerebro-accent"
              >
                <BrainCircuit className="w-4 h-4 mr-2" />
                Tumor Information
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-cerebro-accent"
              >
                <History className="w-4 h-4 mr-2" />
                Analysis History
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="data-[state=active]:bg-cerebro-accent"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-8">
              <Card className="bg-cerebro-dark border border-white/10">
                <CardHeader>
                  <CardTitle>Upload MRI Scan for Analysis</CardTitle>
                  <CardDescription>
                    Upload a brain MRI scan to analyze and detect potential
                    tumors
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UploadAnalysis />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="information" className="space-y-8">
              <Card className="bg-cerebro-dark border border-white/10">
                <CardHeader>
                  <CardTitle>Brain Tumor Types</CardTitle>
                  <CardDescription>
                    Learn about different types of brain tumors
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Meningioma",
                        description:
                          "A tumor that grows in the membranes that cover the brain and spinal cord.",
                        imageSrc:
                          "/lovable-uploads/45448ee1-3600-4145-808d-a788fdd8541e.png",
                      },
                      {
                        title: "Glioma",
                        description:
                          "Tumors that grow in the brain or spinal cord, starting in the glial cells.",
                        imageSrc:
                          "/lovable-uploads/b5069690-0c5f-48d4-b581-0f0c4ffdd730.png",
                      },
                      {
                        title: "Pituitary Tumor",
                        description:
                          "An abnormal growth of cells in the pituitary gland at the base of the brain.",
                        imageSrc:
                          "/lovable-uploads/67e6833e-5bad-4871-a519-c49e8cf4ea18.png",
                      },
                      {
                        title: "No Tumor",
                        description:
                          "Normal brain tissue without any abnormal cell growth.",
                        imageSrc:
                          "/lovable-uploads/d66e0df9-0bf7-4437-b8a7-ddf325e37a7b.png",
                      },
                    ].map((tumorType, index) => (
                      <div
                        key={index}
                        className="flex flex-col bg-white/5 rounded-lg overflow-hidden"
                      >
                        <img
                          src={tumorType.imageSrc}
                          alt={`${tumorType.title} MRI scan`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-xl font-medium mb-2">
                            {tumorType.title}
                          </h3>
                          <p className="text-gray-300 mb-4 flex-1">
                            {tumorType.description}
                          </p>
                          <Button
                            asChild
                            variant="ghost"
                            className="group hover:bg-cerebro-accent/10 mt-auto"
                          >
                            <a
                              href={`/tumor-types#${tumorType.title.toLowerCase()}`}
                              className="flex items-center"
                            >
                              Learn more
                              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    <Button
                      asChild
                      className="bg-cerebro-accent hover:bg-cerebro-accent/90"
                    >
                      <a href="/tumor-types">View Full Tumor Information</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-8">
              <Card className="bg-cerebro-dark border border-white/10">
                <CardHeader>
                  <CardTitle>Analysis History</CardTitle>
                  <CardDescription>
                    View your recent MRI scan analyses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="inline-block animate-spin h-8 w-8 border-4 border-cerebro-accent border-t-transparent rounded-full mb-4"></div>
                      <p className="text-gray-300">
                        Loading analysis history...
                      </p>
                    </div>
                  ) : analysisHistory.length > 0 ? (
                    <div className="space-y-4">
                      {analysisHistory.map((analysis) => (
                        <div
                          key={analysis.id}
                          className="bg-white/5 rounded-lg overflow-hidden flex"
                        >
                          <div className="w-24 h-24 shrink-0">
                            <img
                              src={`http://localhost:5000/${analysis.imagePath.replace(
                                /\\/g,
                                "/"
                              )}`}
                              alt="MRI scan"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{analysis.result}</h4>
                              <div className="flex items-center">
                                <span
                                  className={`text-xs px-2 py-1 rounded-full mr-2 ${
                                    analysis.status === "success"
                                      ? "bg-green-500/20 text-green-400"
                                      : analysis.status === "error"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                                >
                                  {analysis.confidence}% confidence
                                </span>
                                <button
                                  onClick={() => deleteAnalysis(analysis.id)}
                                  className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white/10"
                                  aria-label="Delete analysis"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-gray-400">
                              {format(new Date(analysis.createdAt), "PPP p")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileImage className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">
                        No analysis history found
                      </h3>
                      <p className="text-gray-400 mb-6">
                        Upload your first MRI scan to start building your
                        analysis history.
                      </p>
                      <Button
                        onClick={() => setActiveTab("upload")}
                        className="bg-cerebro-accent hover:bg-cerebro-accent/90"
                      >
                        Upload MRI Scan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help" className="space-y-8">
              <Card className="bg-cerebro-dark border border-white/10">
                <CardHeader>
                  <CardTitle>Help & Support</CardTitle>
                  <CardDescription>
                    Get help with using CereBro AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-medium">
                      Frequently Asked Questions
                    </h3>
                    <div className="space-y-6">
                      {[
                        {
                          question:
                            "What file types are supported for MRI scan uploads?",
                          answer:
                            "CereBro AI supports common image formats such as JPEG, PNG, and DICOM files for MRI scan analyses.",
                        },
                        {
                          question: "How accurate is the tumor detection?",
                          answer:
                            "Our AI model has been trained on thousands of verified MRI scans and achieves an accuracy rate of over 95% in detecting common brain tumors.",
                        },
                        {
                          question: "Is my data secure and private?",
                          answer:
                            "Yes. All uploads are encrypted, and we adhere to strict medical data privacy standards. Your scans are not shared with third parties.",
                        },
                        {
                          question: "Can I export the analysis results?",
                          answer:
                            "Yes, analysis results can be exported as PDF reports that can be shared with healthcare providers.",
                        },
                      ].map((faq, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">{faq.question}</h4>
                          <p className="text-gray-300">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-gray-400 mb-4">
                      Need more help? Our support team is ready to assist you.
                    </p>
                    <Button
                      asChild
                      className="bg-cerebro-accent hover:bg-cerebro-accent/90"
                    >
                      <a href="/contact">Contact Support</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      {/* Chatbot Integration */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;
