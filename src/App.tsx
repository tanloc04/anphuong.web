import { Outlet } from "react-router-dom";
import UserAnalize from "./pages/admin/UserAnalize/layout";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <UserAnalize />
      <Outlet />
    </div>
  );
}
