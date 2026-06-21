import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from './ThemeProvider';
import { AuthProvider } from './AuthProvider';
import Header from './Header';
import { PageTransition } from './PageTransition';
import { Toaster } from './Toaster';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '内容管理平台',
  description: '简洁优雅的内容管理系统',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Header />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <footer className="border-t border-border py-8">
              <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-sm text-muted-foreground">
                <p>&copy; 2026 内容管理平台</p>
                <div className="flex gap-6">
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    隐私政策
                  </a>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    服务条款
                  </a>
                </div>
              </div>
            </footer>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
