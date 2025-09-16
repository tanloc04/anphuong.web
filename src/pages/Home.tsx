import HeroSection from "../components/HeroSection";
import { ProductCategories } from "../components/ProductCategories";
import { BrandIntroduction } from "../components/BrandIntroduction";
import { BlogNews } from "../components/BlogNews";

const Home = () => {
  return (
    <>
      <HeroSection />
      <ProductCategories />
      <BrandIntroduction />
      <BlogNews />
    </>
  );
};

export default Home;
