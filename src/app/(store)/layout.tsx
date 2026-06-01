import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { Toaster } from "react-hot-toast";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[68px]">{children}</main>
      <Footer />
      <ChatWidget />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--bg-white)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            fontSize: "14px",
            boxShadow: "var(--shadow-lg)",
            padding: "12px 16px",
          },
          success: { iconTheme: { primary: "#B8860B", secondary: "#fff" } },
          error:   { iconTheme: { primary: "#DC2626", secondary: "#fff" } },
        }}
      />
    </>
  );
}
