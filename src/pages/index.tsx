import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Calculator } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>SAT Practice Site</title>
        <meta name="description" content="SAT practice questions and tests" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-indigo-950 text-slate-200">
        <header className="backdrop-blur-sm bg-slate-900/70 sticky top-0 z-10 border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-md">
                  <BookOpen size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">SAT Practice</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex items-center justify-center min-h-[80vh]">
          <div className="max-w-lg w-full px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">
                SAT Practice Questions
              </h2>
              <p className="text-lg text-slate-300">
                Choose a subject to start practicing
              </p>
            </div>
            
            <div className="grid gap-6">
              <Link href="/practice?type=rw" className="w-full">
                <Button className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 flex items-center gap-3 text-xl">
                  <BookOpen size={24} />
                  Reading & Writing
                </Button>
              </Link>
              
              <Link href="/practice?type=math" className="w-full">
                <Button className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 flex items-center gap-3 text-xl">
                  <Calculator size={24} />
                  Math
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
