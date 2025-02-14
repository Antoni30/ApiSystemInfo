"use client";
import { useEffect, useState } from "react";
import { auth } from "@/utils/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "../../styles/dashboard.module.css";
import CPUMonitor from "@/components/monitoring/CPUMonitor";
import MemoryMonitor from "@/components/monitoring/MemoryMonitor";
import NetworkMonitor from "@/components/monitoring/NetworkMonitor";
import ProcessMonitor from "@/components/monitoring/ProcessMonitor";
import DiskMonitor from "@/components/monitoring/DiskMonitor";
import { FaUserCircle, FaBars } from "react-icons/fa"; // Iconos de usuario y hamburguesa
import { WebSocketProvider } from "@/utils/WebSocketContext";

const Dashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Verificar si el usuario está autenticado
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                router.push("/"); // Redirige si no hay sesión activa
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <WebSocketProvider>
            <div className={styles.dashboardContainer}>
                <div className={styles.dashboardHeaderContainer}>
                    <img src="/icon.png" alt="Icon" className={styles.dashboardHeaderImage} />
                    <h1 className={styles.dashboardHeader}>Bienvenido al Dashboard</h1>
                </div>
                <nav className={styles.navbar}>
                    <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                        <FaBars />
                    </button>
                    <div className={`${styles.navLinks} ${menuOpen ? styles.showMenu : ""}`}>
                        <a href="#cpu">CPU</a>
                        <a href="#memory">Memoria</a>
                        <a href="#network">Red</a>
                        <a href="#process">Procesos</a>
                        <a href="#disk">Disco</a>
                        <span className={`material-symbols-rounded ${styles.closeBtn} `} onClick={() => setMenuOpen(false)}>close</span>
                    </div>
                    <div className={styles.userMenu}>
                        <FaUserCircle className={styles.userIcon} />
                        <div className={styles.userMenuContent}>
                            {user && <a href="#">{user.email}</a>}
                            <a href="#" onClick={() => signOut(auth).then(() => router.push("/"))}>Cerrar Sesión</a>
                        </div>
                    </div>
                </nav>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div id="cpu"><CPUMonitor /></div>
                    <div id="memory"><MemoryMonitor /></div>
                    <div id="network"><NetworkMonitor /></div>
                    <div id="disk"><DiskMonitor /></div>
                    <div id="process" className="col-span-1 md:col-span-2"><ProcessMonitor /></div>
                </div>
            </div>
        </WebSocketProvider>
    );
};

export default Dashboard;