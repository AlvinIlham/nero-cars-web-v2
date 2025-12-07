"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { getAllFAQs } from "@/lib/database";
import { FAQ as FAQType } from "@/types";

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQType[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFAQs() {
      const data = await getAllFAQs();
      setFaqs(data);
      // Open first FAQ by default if available
      if (data.length > 0) {
        setOpenId(data[0].id);
      }
      setLoading(false);
    }
    fetchFAQs();
  }, []);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p>Loading FAQs...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-white/70">
            Pertanyaan yang sering ditanyakan seputar NeroCars.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10">
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors">
                <span className="text-white font-medium pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  {openId === faq.id ? (
                    <Check className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/50" />
                  )}
                </div>
              </button>

              {/* Answer */}
              {openId === faq.id && faq.answer && (
                <div className="px-6 pb-4 pt-2 border-t border-white/10">
                  <div className="text-white/80 text-sm whitespace-pre-line bg-slate-700/30 rounded-lg p-4">
                    {faq.answer.split("\n\n").map((paragraph, idx) => (
                      <div key={idx} className="mb-3 last:mb-0">
                        {paragraph.split("\n").map((line, lineIdx) => {
                          if (line.startsWith("• ")) {
                            const [label, value] = line
                              .substring(2)
                              .split(": ");
                            return (
                              <div key={lineIdx} className="mb-2">
                                <span className="text-blue-400 font-semibold">
                                  {label}:
                                </span>{" "}
                                <span>{value}</span>
                              </div>
                            );
                          }
                          return (
                            <p key={lineIdx} className="mb-1">
                              {line}
                            </p>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
