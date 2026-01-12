import HeroSection from "./(home)/HeroSection";
import WhyChooseUs from "./(home)/WhyChooseUs";
import ServicesSection from "./(home)/ServicesSection";
import TestimonialsSection from "./(home)/TestimonialsSection";
import ContactSection from "./(home)/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
