import { getDictionary } from '@/i18n/getDictionary';
import type { Locale } from '@/i18n/config';
import Preloader from '@/components/layout/Preloader';
import Navbar from '@/components/layout/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AqabaSection from '@/components/sections/AqabaSection';
import AboutSection from '@/components/sections/AboutSection';
import FleetSection from '@/components/sections/FleetSection';
import PricingSection from '@/components/sections/PricingSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/layout/Footer';
import WaveDivider from '@/components/layout/WaveDivider';
import AnimationProvider from '@/components/AnimationProvider';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    keywords: dict.meta.keywords,
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return (
    <>
      <Preloader text={dict.preloader.text} />
      <Navbar dict={dict} locale={locale} />
      <AnimationProvider>
        <HeroSection dict={dict} />
        <WaveDivider />
        <AqabaSection dict={dict} />
        <WaveDivider flip />
        <AboutSection dict={dict} />
        <WaveDivider />
        <FleetSection dict={dict} />
        <WaveDivider flip />
        <PricingSection dict={dict} />
        <WaveDivider />
        <ExperienceSection dict={dict} />
        <WaveDivider flip />
        <ReviewsSection dict={dict} />
        <WaveDivider />
        <ContactSection dict={dict} />
      </AnimationProvider>
      <Footer dict={dict} />
    </>
  );
}
