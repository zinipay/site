import Head from "next/head";

export default function LandingFeaturePage() {
  return (
    <>
      <Head>
        <title>ZiniPay - ল্যান্ডিং পেজ ফিচার</title>
        <meta
          name="description"
          content="ZiniPay দিয়ে আপনার নিজের পেমেন্ট ল্যান্ডিং পেজ বানান। সহজ, নিরাপদ এবং সম্পূর্ণ স্বাধীন সিস্টেম।"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-50 text-gray-800">
        <section className="bg-indigo-600 text-white py-12 px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">ZiniPay ল্যান্ডিং পেজ</h1>
          <p className="text-lg max-w-3xl mx-auto">
            এটা একটি ZiniPay দ্বারা প্রদত্ত ল্যান্ডিং পেজ সিস্টেম যেখানে আপনারা
            নিজেদের প্রোডাক্ট বা সার্ভিস বিক্রি করতে পারেন। এটি মেইন ডোমেইন
            (zinipay.com) এর একটি ফিচার যা ব্যবহার করে যে কেউ নিজের বিক্রির জন্য
            একটি ল্যান্ডিং পেজ বানাতে পারে।
          </p>
        </section>

        <section className="py-16 px-6 max-w-5xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">📌 এই পেজটি কী?</h2>
            <p>
              আপনি এখন যে পেজটি দেখছেন, এটি ZiniPay দ্বারা তৈরি একটি ফিচারের
              অংশ — <strong>ল্যান্ডিং পেজ</strong>। এখানে আপনারা নিজেদের পণ্য বা
              সার্ভিসের জন্য একটি আলাদা পেমেন্ট পেজ বানাতে পারবেন যা সরাসরি আপনার
              ক্লায়েন্টদেরকে পেমেন্ট করতে সাহায্য করবে।
            </p>

            <h2 className="text-2xl font-semibold">💼 কে কাকে টাকা দিবে?</h2>
            <p>
              এই পেজের মাধ্যমে কেউ টাকা পাঠালে সেই টাকা পেজ মালিক, অর্থাৎ যিনি
              এই ল্যান্ডিং পেজ বানিয়েছেন, <strong>তিনি পাবেন</strong>। এখানে
              ZiniPay শুধুমাত্র একটি গেটওয়ে হিসেবে কাজ করছে — কোনো অর্থ নিজের কাছে
              রাখে না।
            </p>

            <h2 className="text-2xl font-semibold">⚠️ ZiniPay এর দায়ভার</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                ZiniPay শুধুমাত্র একটি <strong>পেমেন্ট গেটওয়ে</strong> হিসেবে কাজ
                করে।
              </li>
              <li>
                এখানে বিক্রি হওয়া প্রোডাক্ট বা সার্ভিসের গুণমান, ডেলিভারি, বা
                বিশ্বাসযোগ্যতা সম্পর্কে ZiniPay দায়ী নয়।
              </li>
              <li>
                যদি কোনো ব্যক্তি প্রতারণা করে তবে তার দায়ভার{" "}
                <strong>ZiniPay বহন করবে না</strong>।
              </li>
            </ul>

            <h2 className="text-2xl font-semibold">🚀 ল্যান্ডিং পেজ ফিচার</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>নিজস্ব প্রোডাক্ট বা সার্ভিস যুক্ত করার সুবিধা</li>
              <li>স্বতন্ত্র লিংক ও ডোমেইনের অধীনে প্রেজেন্টেশন</li>
              <li>নিরাপদ পেমেন্ট গেটওয়ে সংযুক্তি (bKash, Nagad, Card etc.)</li>
              <li>পেমেন্ট হলে তা সরাসরি আপনার একাউন্টে জমা হবে</li>
              <li>আপনি চাইলে একাধিক ব্র্যান্ড বা অফার যুক্ত করতে পারবেন</li>
            </ul>

            <div className="mt-8 text-center">
              <a
                href="https://zinipay.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                ZiniPay ওয়েবসাইট ভিজিট করুন
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-gray-900 text-gray-300 py-6 text-center">
          <p>&copy; 2024 ZiniPay | একটি আধুনিক পেমেন্ট সমাধান</p>
        </footer>
      </main>
    </>
  );
}
