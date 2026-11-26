import {
  BookOpenIcon,
  CalculatorIcon,
  FileTextIcon,
  FlaskConicalIcon,
  PillIcon,
  SearchIcon,
} from "lucide-react";

import { AuroraText } from "@/components/ui/aurora-text";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { DotPattern } from "@/components/ui/dot-pattern";
import { NumberTicker } from "@/components/ui/number-ticker";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { cn } from "@/lib/utils";

// Mirrors the 8 tool functions exported from ../src/tools.ts.
const features = [
  {
    Icon: SearchIcon,
    name: "البحث في PubMed",
    description: "ابحث في الأدبيات الطبية المحكّمة بسرعة.",
    href: "#tools",
    cta: "المزيد",
    className: "col-span-3 lg:col-span-2",
  },
  {
    Icon: PillIcon,
    name: "فحص التداخلات الدوائية",
    description: "تحقّق من التداخلات بين دواءين أو أكثر.",
    href: "#tools",
    cta: "المزيد",
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: FlaskConicalIcon,
    name: "تفسير التحاليل المخبرية",
    description: "قراءة منظّمة لنتائج المختبر.",
    href: "#tools",
    cta: "المزيد",
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: BookOpenIcon,
    name: "الإرشادات السريرية",
    description: "الوصول إلى إرشادات الممارسة السريرية حسب الموضوع.",
    href: "#tools",
    cta: "المزيد",
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: CalculatorIcon,
    name: "الحاسبات السريرية",
    description: "معادلات سريرية شائعة في مكان واحد.",
    href: "#tools",
    cta: "المزيد",
    className: "col-span-3 lg:col-span-1",
  },
  {
    Icon: FileTextIcon,
    name: "التقارير والعروض",
    description: "توليد تقارير سريرية منظّمة وعروض PowerPoint.",
    href: "#tools",
    cta: "المزيد",
    className: "col-span-3",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          )}
        />
        <BlurFade delay={0.1} inView>
          <h1 className="relative z-10 text-4xl font-bold tracking-tight sm:text-6xl">
            <AuroraText>Great-AI</AuroraText>
          </h1>
        </BlurFade>
        <BlurFade delay={0.25} inView>
          <p className="relative z-10 mt-6 max-w-xl text-lg text-muted-foreground">
            مجموعة أدوات لدعم القرار السريري: البحث الطبي، والتداخلات الدوائية،
            وتفسير التحاليل، وإعداد التقارير.
          </p>
        </BlurFade>
        <BlurFade delay={0.4} inView>
          <a href="#tools" className="relative z-10 mt-8 inline-block">
            <ShimmerButton className="shadow-2xl">
              <span className="text-sm font-medium text-white lg:text-base">
                استكشف الأدوات
              </span>
            </ShimmerButton>
          </a>
        </BlurFade>
      </section>

      <section id="tools" className="mx-auto w-full max-w-5xl px-4 py-24">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">
            <NumberTicker value={8} /> أدوات سريرية
          </h2>
          <p className="mt-2 text-muted-foreground">
            قيد التطوير — الواجهات جاهزة والمنطق قيد التنفيذ.
          </p>
        </div>
        <BentoGrid className="auto-rows-[16rem]">
          {features.map((feature) => (
            <BentoCard
              key={feature.name}
              {...feature}
              background={<div className="absolute inset-0" />}
            />
          ))}
        </BentoGrid>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        للأغراض التعليمية والبحثية فقط — لا يغني عن الرأي الطبي المتخصص.
      </footer>
    </main>
  );
}
