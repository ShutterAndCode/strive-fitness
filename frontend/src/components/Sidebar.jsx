import { ActivityIcon, HomeIcon, PersonStandingIcon, User2Icon, UtensilsIcon } from "lucide-react";
import { NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/food", label: "Food", icon: UtensilsIcon },
    { path: "/activity", label: "Activity", icon: ActivityIcon },
    { path: "/profile", label: "Profile", icon: User2Icon },
  ];
  return (
    <nav className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-6 transition-colors duration-200">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
          <PersonStandingIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Strive
        </h1>
      </div>
      <div className="flex flex-col gap-2 mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 transition-all duration-200 border-l-4 ${
                isActive
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200"
              }`
            }
          >
            <item.icon className="size-5" />
            <span className="text-base">{item.label}</span>
          </NavLink>
        ))}
      </div>
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
        <ThemeToggle className="w-full justify-start gap-3 px-4 py-2.5 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200" />
      </div>
    </nav>
  );
};

export default Sidebar;
