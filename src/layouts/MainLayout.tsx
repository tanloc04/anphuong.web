import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Footer } from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Nội dung thay đổi theo từng page */}
      <main className="flex-1 pt-18">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
