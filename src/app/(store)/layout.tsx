import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#1A1917",
            border: "1px solid #E5E4DF",
            borderRadius: "12px",
            fontSize: "14px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
          },
          success: { iconTheme: { primary:"#B8860B", secondary:"#fff" } },
          error:   { iconTheme: { primary:"#DC2626", secondary:"#fff" } },
        }}
      />
    </>
  );
}
