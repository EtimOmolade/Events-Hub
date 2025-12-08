import { Layout } from '@/components/layout/Layout';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedServices } from '@/components/home/FeaturedServices';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { CallToAction } from '@/components/home/CallToAction';

// Hello page
const Index = () => {
  return (
    <Layout>
      <HeroCarousel />
      <CategoryGrid />
      <FeaturedServices />
      <WhyChooseUs />
      <CallToAction />
    </Layout>
  );
};

export default Index;
