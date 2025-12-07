import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import Image from "next/image";

export default function LearningResourcesPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Resources</h1>
        <p className="mt-4 text-gray-600">Welcome to learning resources.</p>
      </div>

      <div>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="flex items-center justify-between font-semibold text-lg text-[#548584] bg-gradient-to-r from-[#ccfbeb75] to-[#b4dafe74] rounded-lg shadow-md py-7 px-6 data-[state=open]:text-[#2F5B5A] data-[state=open]:shadow-inner">
              <div className="flex items-center gap-4">
                United States Medical Licensing Examination
                <Image
                  src="/card1.png"
                  alt="Card 1"
                  width={160}
                  height={160}
                  className="object-contain"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <h3 className="font-semibold text-gray-900 mt-4">
                What is USMLE?:
              </h3>
              <p>
                The United States Medical Licensing Examination (USMLE) is a
                three-step examination for medical licensure in the United
                States. It assesses a physician&apos;s ability to apply
                knowledge, concepts, and principles, and to demonstrate
                fundamental patient-centered skills.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">Resources:</h3>

              <ul className="list-disc list-inside space-y-1">
                <li>
                  <a
                    href="https://www.amazon.com/First-USMLE-Step-Thirty-Third/dp/1264946627?utm_source=chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    First Aid for USMLE Step 1
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.amazon.com/USMLE-Step-Qbook-Exam-Like-Questions/dp/1506223540?utm_source=chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    USMLE Step 1 QBook
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="flex items-center justify-between font-semibold text-lg text-[#9C7241] bg-gradient-to-r from-[#FEF4EB] to-[#FFF9F6] rounded-lg shadow-md py-7 px-6 data-[state=open]:text-[#5b3f1f] data-[state=open]:shadow-inner">
              <div className="flex items-center gap-4">
                Fellowship of the College of Physicians and Surgeons
                <Image
                  src="/card4.png"
                  alt="Card 2"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <h3 className="font-semibold text-gray-900 mt-4">
                What is FCPS?:
              </h3>
              <p>
                The Fellowship of the College of Physicians and Surgeons (FCPS)
                is a postgraduate medical qualification awarded in countries
                like Pakistan, India, and some other Commonwealth countries.
                It&apos;s usually offered by the College of Physicians and
                Surgeons Pakistan (CPSP) or equivalent institutions
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">Resources:</h3>

              <ul className="list-disc list-inside space-y-1">
                <li>
                  <a
                    href="https://www.booksplus.pk/product/fcps-pearls-part-1-by-rafi-ullah/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    FCPS Pearls Part 1 by Dr Rafi Ullah
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.jinnahmedicalbooks.com/product/sk-original-golden-files-surgery-and-allied-for-fcps-1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    SK Original Golden Files Surgery & Allied for FCPS 1 by Dr
                    Salahuddin Kamal
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="flex items-center justify-between font-semibold text-lg text-[#711B9C] bg-gradient-to-r from-[#F1E5FF] to-[#F7EFFF] rounded-lg shadow-md py-7 px-6 data-[state=open]:text-[#3e0f56] data-[state=open]:shadow-inner ">
              <div className="flex items-center gap-4">
                Professional and Linguistic Assessments Board
                <Image
                  src="/card3.png"
                  alt="Card 3"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </div>
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4 text-balance">
              <h3 className="font-semibold text-gray-900 mt-4">
                What is PLAB?:
              </h3>
              <p>
                The Professional and Linguistic Assessments Board (PLAB) test is
                an exam conducted by the General Medical Council (GMC) in the
                UK. It evaluates international medical graduates to ensure they
                have the necessary skills and knowledge to practice safely as
                doctors in the UK.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">Resources:</h3>

              <ul className="list-disc list-inside space-y-1">
                <li>
                  <a
                    href="https://www.amazon.in/PLAB-Part-1-Vol/dp/8188867276?utm_source=chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    PLAB part 1
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.amazon.in/PLAB-Essentials-Questions-Explanations-Mastering-ebook/dp/B0D9DHK3Y3?utm_source=chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    PLAB Part 1 Essentials
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.amazon.in/Key-Tips-PLAB-High-Yield-Explanations-ebook/dp/B0DW9G4JBS?utm_source=chatgpt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Key tips for PLAB 1
                  </a>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
