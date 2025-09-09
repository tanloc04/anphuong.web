import Header from "../components/Header"
import HeroSection from "../components/HeroSection"

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        {/* <ProductCategories /> */}
        {/* <BrandIntroduction /> */}
        {/* <CompletedProjects /> */}
        {/* <BlogNews /> */}
      </main>
      {/* <Footer /> */}
    </div>
  )
}

export default Home