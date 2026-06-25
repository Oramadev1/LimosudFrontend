import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import ToastContainer from "@/components/Toast";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 min-w-0 overflow-x-hidden bg-[#F5F5F5]">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}
