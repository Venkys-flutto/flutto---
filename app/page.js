import Image from "next/image";
import MainCard from "./components/Main_Card";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-no-repeat">
    <MainCard />
      </div>
  );
}
