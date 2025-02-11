import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "./contexts/auth";
import { ToastContainer } from "react-toastify";  // Importando o ToastContainer
import 'react-toastify/dist/ReactToastify.css';  // Importando o CSS
import OrdemProvider from "./contexts/newOrdem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerencia OS",
  description: "Sistema de gerenciamento de ordens de serviços.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <OrdemProvider>
          {/* O ToastContainer aqui vai garantir que os toasts apareçam globalmente */}
          <ToastContainer autoClose={3000} position="top-right" />
          {children}
          </OrdemProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
