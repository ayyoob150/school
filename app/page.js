import School from "@/components/School";

export default function Home() {

  return (
    <div className=" font-[family-name:var(--font-geist-sans)]">
      <div className="text-center text-3xl font-semibold text-slate-600 py-6"> Welcome to our Dashboard ! </div>
      <School/>
    </div>
  );
}

