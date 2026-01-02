import { motion } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import { ProductCategories } from "@/components/ProductCategories";
import { BrandIntroduction } from "@/components/BrandIntroduction";
import { BlogNews } from "@/components/BlogNews";
import { SpecialProduct } from "@/components/SpecialProduct";

const Home = () => {
  return (
    <>
      {/* Hero giữ nguyên */}
      <HeroSection />

      {/* Product: float từ trên xuống */}
      <div className="relative">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full"
        >
          <SpecialProduct />
        </motion.div>
      </div>
      
      {/* ProductCategories: float từ trên xuống */}
      <div className="relative">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full"
        >
          <ProductCategories />
        </motion.div>
      </div>

      {/* BrandIntroduction: từ trái qua phải */}
      <div className="relative">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full"
        >
          <BrandIntroduction />
        </motion.div>
      </div>

      {/* BlogNews: từ phải qua trái */}
      <div className="relative">
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full"
        >
          <BlogNews />
        </motion.div>
      </div>
    </>
  );
};

export default Home;
