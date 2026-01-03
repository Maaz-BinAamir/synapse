import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import Image from "next/image";

export default function LearningResourcesPage() {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-[#F7E8FF] via-white to-[#E0F7FA] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Text */}
          <div>
            <h1 className="text-3xl font-bold text-[#9D83C4] font-serif">
              Learning Resources
            </h1>
            <p className="text-gray-500 mt-1">
              Find useful resources to help you learn.
            </p>
          </div>

          {/* Divider BELOW text */}
          <div className="flex justify-center w-full">
            <div className="w-full max-w-4xl">
              <div className="relative mt-2 w-full">
                {/* Line */}
                <div className="h-0.5 w-full bg-gray-200 rounded-full" />

                {/* Stethoscope */}
                <div className="absolute right-4 -top-4 w-[60px] h-[60px]">
                  <Image
                    src="/stethoscope.png"
                    alt="Stethoscope"
                    width={60}
                    height={60}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="absolute left-0 -top-1 w-12 h-1 bg-orange-300" />
                <div className="absolute left-0 top-0 w-8 h-1 bg-blue-200" />
                <div className="absolute right-0 -top-1 w-12 h-1 bg-orange-300" />
                <div className="absolute right-0 top-0 w-8 h-1 bg-blue-200" />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-0">
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-[80%] mx-auto gap-6"
            defaultValue="item-1"
          >
            {/* USMLE */}
            <AccordionItem value="item-1">
              <AccordionTrigger className="flex items-center justify-center font-semibold text-lg text-[#548584] bg-linear-to-r from-[#ccfbeb4a] to-[#b4dafe3c] rounded-lg shadow-md py-7 px-6  data-[state=open]:text-[#2F5B5A] data-[state=open]:shadow-inner">
                <div className="flex items-center gap-4">
                  United States Medical Licensing Examination
                  <div className="w-[120px] h-[120px] shrink-0">
                    <Image
                      src="/card1.png"
                      alt="Card 1"
                      width={120}
                      height={120}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <h3 className="font-semibold text-gray-900 mt-4">
                  What is USMLE?
                </h3>
                <p>
                  The USMLE is a three-step examination for medical licensure in
                  the United States. It assesses a physician&apos;s ability to
                  apply knowledge, concepts, and principles, and demonstrate
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
                  <li>
                    <a
                      href="https://www.kaptest.com/usmle"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Kaplan USMLE Prep
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.usmle.org/prep-materials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Official USMLE Practice Materials
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* FCPS */}
            <AccordionItem value="item-2">
              <AccordionTrigger className="flex items-center justify-center font-semibold text-lg text-[#9C7241] bg-linear-to-r from-[#FEF4EB] to-[#FFF9F6] rounded-lg shadow-md py-7 px-6 data-[state=open]:text-[#5b3f1f] data-[state=open]:shadow-inner">
                <div className="flex items-center gap-4">
                  Fellowship of the College of Physicians and Surgeons
                  <div className="w-[60px] h-[60px] shrink-0">
                    <Image
                      src="/card4.png"
                      alt="Card 2"
                      width={60}
                      height={60}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <h3 className="font-semibold text-gray-900 mt-4">
                  What is FCPS?
                </h3>
                <p>
                  FCPS is a postgraduate medical qualification offered in
                  countries like Pakistan, India, and other Commonwealth
                  countries. It is awarded by the College of Physicians and
                  Surgeons Pakistan (CPSP) or equivalent institutions.
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
                      SK Original Golden Files Surgery & Allied for FCPS 1
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.cpsp.edu.pk/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Official CPSP FCPS Guidelines
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.amazon.com/FCPS-Examination-Preparation-Books/s?k=FCPS+Examination+Preparation"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      FCPS Exam Prep Books Collection
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* PLAB */}
            <AccordionItem value="item-3">
              <AccordionTrigger className="flex items-center justify-center font-semibold text-lg text-[#711B9C] bg-linear-to-r from-[#f1e5ff58] to-[#f7efff7d] rounded-lg shadow-md py-7 px-6 data-[state=open]:text-[#3e0f56] data-[state=open]:shadow-inner">
                <div className="flex items-center gap-4">
                  Professional and Linguistic Assessments Board
                  <div className="w-[60px] h-[60px] shrink-0">
                    <Image
                      src="/card3.png"
                      alt="Card 3"
                      width={60}
                      height={60}
                      priority
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="flex flex-col gap-4 text-balance">
                <h3 className="font-semibold text-gray-900 mt-4">
                  What is PLAB?
                </h3>
                <p>
                  PLAB is conducted by the General Medical Council (GMC) in the
                  UK for international medical graduates. It ensures they have
                  the skills and knowledge to practice safely as doctors in the
                  UK.
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
                      PLAB Part 1 Book
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
                      Key Tips for PLAB 1
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.gmc-uk.org/education/standards-guidance-and-curricula/plab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Official GMC PLAB Resources
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
