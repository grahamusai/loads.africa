import Link from "next/link";
import { Truck, User, Package } from "lucide-react";
import Navbar from "./components/navbar";
import Header from "./components/header";
import Features from "./components/features";
import Benefits from "./components/benefits";
import Cta from "./components/cta";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <Header />
      <Features />
      <Benefits />
      <Cta />
    </div>
  );
}
