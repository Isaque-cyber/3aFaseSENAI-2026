import { Outlet } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import SideMenu from "../components/SideMenu";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const DashboardLayout = () => {

    const { user, logout } = useAuth();

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {

    if (darkMode) {

        document.body.classList.add("dark");

    } else {

        document.body.classList.remove("dark");

    }

    localStorage.setItem(
        "theme",
        darkMode ? "dark" : "light"
    );

}, [darkMode]);

    return (

        <div
            className={`flex min-h-screen transition-colors duration-300 ${
                darkMode
                    ? "bg-gray-900"
                    : "bg-gray-100"
            }`}
        >

            {/* Barra lateral */}

            <SideMenu />

            {/* Conteúdo */}

            <main className="flex-1 flex flex-col">

                <header
                    className={`flex justify-between items-center p-4 shadow transition-colors duration-300 ${
                        darkMode
                            ? "bg-gray-800"
                            : "bg-white"
                    }`}
                >

                    <h1
                        className={`text-xl font-bold ${
                            darkMode
                                ? "text-cyan-300"
                                : "text-cyan-800"
                        }`}
                    >
                        Painel do Sistema
                    </h1>

                    {

                        user && (

                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => setDarkMode(!darkMode)}
                                    className={`transition ${
                                        darkMode
                                            ? "text-yellow-400"
                                            : "text-cyan-700"
                                    }`}
                                >
                                    {
                                        darkMode
                                            ? <FaSun size={20} />
                                            : <FaMoon size={20} />
                                    }
                                </button>

                                <span
                                    className={
                                        darkMode
                                            ? "text-gray-200"
                                            : "text-gray-700"
                                    }
                                >
                                    Bem Vindo, {user.email}
                                </span>

                                <button
                                    onClick={logout}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                >
                                    Sair
                                </button>

                            </div>

                        )

                    }

                </header>

                <section
                    className={`flex-1 p-6 overflow-y-auto transition-colors duration-300 ${
                        darkMode
                            ? "bg-gray-900 text-white"
                            : ""
                    }`}
                >

                    <Outlet />

                </section>

            </main>

        </div>

    );
};

export default DashboardLayout;