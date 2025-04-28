import Head from "next/head";
import Link from "next/link";
import { BookOpen, Calculator } from "@/components/icons";
import "@/styles/home.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>SAT Practice Site</title>
        <meta name="description" content="SAT practice questions and tests" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <div className="logo-icon">
                <BookOpen size={20} />
              </div>
              <h1 className="logo-text">SAT Practice</h1>
            </div>
          </div>
        </header>

        <main className="main">
          <div className="content">
            <div className="title-section">
              <h2 className="title">
                SAT Practice Questions
              </h2>
              <p className="subtitle">
                Choose a subject to start practicing
              </p>
            </div>
            
            <div className="buttons-container">
              <Link href="/practice?type=rw">
                <button className="button">
                  <BookOpen size={20} />
                  Reading & Writing
                </button>
              </Link>
              
              <Link href="/practice?type=math">
                <button className="button">
                  <Calculator size={20} />
                  Math
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
