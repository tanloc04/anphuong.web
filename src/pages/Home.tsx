import { BlogNews } from "../components/BlogNews"
import { BrandIntroduction } from "../components/BrandIntroduction"
import { Footer } from "../components/Footer"
import Header from "../components/Header"
import HeroSection from "../components/HeroSection"
import { ProductCategories } from "../components/ProductCategories"

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProductCategories />
        <BrandIntroduction />
        <BlogNews />
      </main>
      <Footer />
    </div>
  )
}

export default Home