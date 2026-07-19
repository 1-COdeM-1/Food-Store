import { HeroSection } from './HeroSection';
import { CategorySection } from './CategorySection';
import { FeaturedSection } from './FeaturedSection';

export function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
    </div>
  );
}
