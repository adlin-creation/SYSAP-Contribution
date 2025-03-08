import { useState, useEffect } from "react";
import {
  Route,
  Routes,
  Link,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import "./i18n";
import ExerciseMenu from "./components/Exercise/ExerciseMenu";
import ProgramMenu from "./components/Program/ProgramMenu";
import Home from "./components/Home/Home";
import CycleMenu from "./components/Cycle/CycleMenu";
import SessionMenu from "./components/Session/SessionMenu";
import BlocMenu from "./components/Bloc/BlocMenu";
import PhaseMenu from "./components/ProgramPhase/PhaseMenu";
import Login from "./components/Authentication/Login";
import PatientMenu from "./components/Patient/PatientMenu";
import DoctorMenu from "./components/ProfessionalUser/Doctor/DoctorMenu";
import DoctorPatients from "./components/ProfessionalUser/Doctor/DoctorPatients";
import KinesiologistMenu from "./components/ProfessionalUser/Kinesiologist/KinesiologistMenu";
import KinesiologistPatients from "./components/ProfessionalUser/Kinesiologist/KinesiologistPatients";
import AdminMenu from "./components/ProfessionalUser/Admin/AdminMenu";
import useToken from "./components/Authentication/useToken";
import Constants from "./components/Utils/Constants";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";

import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BlockOutlined,
  CalendarOutlined,
  ClusterOutlined,
  PartitionOutlined,
  BellOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  MedicineBoxOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import "antd/dist/reset.css";
import "./App.css";
const { Header, Sider, Content } = Layout;

function App() {
<<<<<<< HEAD
  const { t } = useTranslation(); // la fonction de traduction
=======
  const { t, i18n } = useTranslation(); // la fonction qu'on doit appliquer a la traduction
>>>>>>> c5f3b777a121104d21fba992e12da913698a7810
  const location = useLocation();
  const navigate = useNavigate();

  // Hook personnalisé pour gérer le token
  const { token, setToken } = useToken(); 

  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [role, setRole] = useState("");
  const [menuItems, setMenuItems] = useState([]);

<<<<<<< HEAD
  // Menu principal (référence brute, avant filtrage)
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">{t("App:dashboard")}</Link>,
    },
    {
      key: "/exercises",
      icon: <AppstoreOutlined />,
      label: <Link to="/exercises">{t("App:exercises")}</Link>,
    },
    {
      key: "/blocs",
      icon: <BlockOutlined />,
      label: <Link to="/blocs">{t("App:blocs")}</Link>,
    },
    {
      key: "/sessions",
      icon: <CalendarOutlined />,
      label: <Link to="/sessions">{t("App:sessions")}</Link>,
    },
    {
      key: "/cycles",
      icon: <ClusterOutlined />,
      label: <Link to="/cycles">{t("App:cycles")}</Link>,
    },
    {
      key: "/phases",
      icon: <PartitionOutlined />,
      label: <Link to="/phases">{t("App:phases")}</Link>,
    },
    {
      key: "/programs",
      icon: <SettingOutlined />,
      label: <Link to="/programs">{t("App:programs")}</Link>,
    },
    {
      key: "/patients",
      icon: <UserOutlined />,
      label: <Link to="/patients">{t("App:patients")}</Link>,
    },
    {
      key: "healthcare-professional",
      icon: <UsergroupAddOutlined />,
      label: t("App:professionals"),
      children: [
        {
          key: "/doctors",
          icon: <MedicineBoxOutlined />,
          label: <Link to="/doctors">{t("App:doctors")}</Link>,
        },
        {
          key: "/kinesiologists",
          icon: <HeartOutlined />,
          label: <Link to="/kinesiologists">{t("App:kinesiologists")}</Link>,
        },
        {
          key: "/admins",
          icon: <UserOutlined />,
          label: <Link to="/admins">{t("App:admins")}</Link>,
        },
      ],
    },
  ];
=======
  useEffect(() => {
    const newMenuItems = [
      {
        key: "/",
        icon: <HomeOutlined />,
        label: <Link to="/">{t("App:dashboard")}</Link>,
      },
      {
        key: "/exercises",
        icon: <AppstoreOutlined />,
        label: <Link to="/exercises">{t("App:exercises")}</Link>,
      },
      {
        key: "/blocs",
        icon: <BlockOutlined />,
        label: <Link to="/blocs">{t("App:blocs")}</Link>,
      },
      {
        key: "/sessions",
        icon: <CalendarOutlined />,
        label: <Link to="/sessions">{t("App:sessions")}</Link>,
      },
      {
        key: "/cycles",
        icon: <ClusterOutlined />,
        label: <Link to="/cycles">{t("App:cycles")}</Link>,
      },
      {
        key: "/phases",
        icon: <PartitionOutlined />,
        label: <Link to="/phases">{t("App:phases")}</Link>,
      },
      {
        key: "/programs",
        icon: <SettingOutlined />,
        label: <Link to="/programs">{t("App:programs")}</Link>,
      },
      {
        key: "/patients",
        icon: <UserOutlined />,
        label: <Link to="/patients">{t("App:patients")}</Link>,
      },
      {
        key: "healthcare-professional",
        icon: <UsergroupAddOutlined />,
        label: t("App:professionals"),
        children: [
          {
            key: "/doctors",
            icon: <MedicineBoxOutlined />,
            label: <Link to="/doctors">{t("App:physicians")}</Link>,
          },
          {
            key: "/kinesiologists",
            icon: <HeartOutlined />,
            label: <Link to="/kinesiologists">{t("App:kinesiologists")}</Link>,
          },
          {
            key: "/admins",
            icon: <UserOutlined />,
            label: <Link to="/admins">{t("App:admins")}</Link>,
          },
        ],
      },
    ];

    setMenuItems(newMenuItems);
    setFilteredMenuItems(newMenuItems);
  }, [i18n.language, t]);
>>>>>>> c5f3b777a121104d21fba992e12da913698a7810

  // État pour le menu filtré selon le rôle
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

  useEffect(() => {
<<<<<<< HEAD
    // S’il existe un "role" dans location.state, on le stocke
=======
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
>>>>>>> c5f3b777a121104d21fba992e12da913698a7810
    if (location.state?.role) {
      setRole(location.state.role);

      // Fonction qui filtre le menu selon le rôle
      const filterMenuItems = (items) => {
        return items
          .map((item) => {
            // On gère la logique pour /doctors
            if (item.key === "/doctors") {
              // Visible pour admin et superadmin
              if (
                location.state.role === "admin" ||
                location.state.role === "superadmin"
              ) {
                return item;
              }
              return null;
            }

            // On gère la logique pour /kinesiologists
            if (item.key === "/kinesiologists") {
              // Visible pour admin et superadmin
              if (
                location.state.role === "admin" ||
                location.state.role === "superadmin"
              ) {
                return item;
              }
              return null;
            }

            // On gère la logique pour /admins
            if (item.key === "/admins") {
              // Visible pour superadmin uniquement
              if (location.state.role === "superadmin") {
                return item;
              }
              return null;
            }

            // Si l'utilisateur est doctor ou kinesiologist, on enlève TOUT le bloc "healthcare-professional"
            // => Concrètement, si c'est un item parent ou child, on l'exclut
            if (
              location.state.role === "doctor" ||
              location.state.role === "kinesiologist"
            ) {
              // Si c'est l'item parent (key === "healthcare-professional") ou un enfant,
              // on le vire. On peut juste détecter la présence de "healthcare-professional"
              // ou le fait que item.key soit /doctors, /kinesiologists, /admins, etc.
              if (
                item.key === "healthcare-professional" ||
                item.key === "/doctors" ||
                item.key === "/kinesiologists" ||
                item.key === "/admins"
              ) {
                return null;
              }
            }

            // Pour tout le reste, on le laisse
            return item;
          })
          .filter((it) => it !== null)
          .map((item) => {
            // Si c'est un item parent avec des children, on répète la logique en récursif
            if (item.children) {
              const newChildren = filterMenuItems(item.children);
              return { ...item, children: newChildren };
            }
            return item;
          });
      };

      // On exécute le filtrage
      const newMenu = filterMenuItems(menuItems);
      setFilteredMenuItems(newMenu);
    }
  }, [location.state, menuItems]);

  // Déconnexion
  const handleLogout = async () => {
    try {
      console.log("Attempting to logout...");
      const response = await axios.post(`${Constants.SERVER_URL}/logout`);
      console.log("Logout response:", response);

      setToken(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Menu du user (avatar) dans le header
  const userMenuItems = [
    {
      key: "1",
      label: <Link to="/profile">{t("App:profile")}</Link>,
    },
    {
      key: "2",
      label: <Link to="/settings">{t("App:settings")}</Link>,
    },
    {
      key: "3",
      label: t("App:logout"),
      onClick: handleLogout,
    },
  ];

  // Si pas de token => on oblige la page de login
  if (!token) {
    return (
      <Content className="content">
        <Routes>
          <Route path="login" element={<Login setToken={setToken} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Content>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className={`sider ${i18n.language === "ar" ? "sider-ar" : ""}`}>
        <div className="logo">RxAPA</div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={filteredMenuItems}
        />
      </Sider>
<<<<<<< HEAD
      <Layout className="site-layout">
        <Header className="header site-layout-background">
          <div></div>
=======
      <Layout
        className={`site-layout ${
          i18n.language === "ar" ? "site-layout-ar" : ""
        }`}
      >
        <Header
          className={`header site-layout-background ${
            i18n.language === "ar" ? "header-ar" : ""
          }`}
        >
          <div></div> {/* Empty div to align items to the right */}
>>>>>>> c5f3b777a121104d21fba992e12da913698a7810
          <div className="header-content">
            <LanguageSwitcher
              iconStyle={{ color: "white" }}
              iconClassName="header-language-icon"
            />
            <Button icon={<SettingOutlined />} className="header-button" />
            <Button icon={<BellOutlined />} className="header-button" />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="header-avatar">
                <Avatar icon={<UserOutlined />} />
                {/* Affiche le rôle à droite de l'avatar */}
                <span>{role}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Home />} />
            {/* Menus / Exercices, etc. */}
            <Route path="exercises" element={<ExerciseMenu />} />
            <Route path="blocs" element={<BlocMenu />} />
            <Route path="sessions" element={<SessionMenu />} />
            <Route path="cycles" element={<CycleMenu />} />
            <Route path="phases" element={<PhaseMenu />} />
            <Route path="programs" element={<ProgramMenu />} />
            <Route path="patients" element={<PatientMenu role={role} />} />
            {/* Professionnels */}
            <Route path="doctors" element={<DoctorMenu />} />
            <Route path="doctor-patients/:id" element={<DoctorPatients />} />
            <Route
              path="kinesiologists"
              element={<KinesiologistMenu />}
            />
            <Route
              path="kinesiologist-patients/:id"
              element={<KinesiologistPatients />}
            />
            <Route path="admins" element={<AdminMenu />} />
            {/* 404 */}
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>{t("There's nothing here!")}</p>
                </main>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
