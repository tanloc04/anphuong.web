import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import FloatingPhoneButton from "../components/ui/FloatingPhoneButton";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";

const MainLayout = () => {
  // Parent container với stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // mỗi phần trễ 0.25s
      },
    },
  };

  // Variants cho từng phần tử con
  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.3, ease: "easeOut" },
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Header />
      </motion.div>

      <motion.main className="flex-1 pt-18" variants={itemVariants}>
        <Outlet />
      </motion.main>

      <motion.div variants={itemVariants}>
        <FloatingPhoneButton />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ScrollToTopButton />
      </motion.div>


      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default MainLayout;
