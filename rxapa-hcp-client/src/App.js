// App.js
// Exemple d'application React avec un menu latéral. On filtre le menu en fonction
// du rôle reçu du backend (superadmin, admin, doctor, kinesiologist).

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
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // Hook qui gère le token (localStorage), etc.
  const { token, setToken } = useToken();

  // Gère la sélection d'items dans le menu
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  // Rôle actuel (superadmin, admin, doctor, kinesiologist)
  const [role, setRole] = useState("");

  // Structure de menu (non filtrée)
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

  // État pour stocker le menu filtré
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

  // useEffect qui se déclenche quand on navigue ou quand on récupère le role
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);

      const filterMenuItems = (items, userRole) => {
        return items
          .map((item) => {
            // Repérage du sous-menu "Professionnels"
            if (item.key === "healthcare-professional") {
              // Si role est "doctor" ou "kinesiologist", on supprime tout le sous-menu
              if (userRole === "doctor" || userRole === "kinesiologist") {
                return null;
              }
              // Si role est "admin", on supprime juste l'entrée "/admins"
              if (userRole === "admin") {
                const newChildren = item.children.filter(
                  (child) => child.key !== "/admins"
                );
                return { ...item, children: newChildren };
              }
              // Si role est "superadmin", on ne filtre rien
              if (userRole === "superadmin") {
                return item;
              }
              // Si autre chose => à toi de décider (on laisse tout par défaut ou on supprime)
              return null;
            }
            // Sinon on ne touche pas l'item
            return item;
          })
          .filter((i) => i !== null);
      };

      const newMenu = filterMenuItems(menuItems, location.state.role);
      setFilteredMenuItems(newMenu);
    }
  }, [location.state]);

  /**
   * Déconnexion
   */
  const handleLogout = async () => {
    try {
      await axios.post(`${Constants.SERVER_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setToken(null);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  /**
   * Menu utilisateur (avatar en haut à droite)
   */
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

  /**
   * Si pas de token, on renvoie l'utilisateur vers /login
   */
  if (!token) {
    return (
      <Content className="content">
        <Routes>
          <Route path="login" element={<Login setToken={setToken} />}></Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Content>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider className="sider">
        <div className="logo">RxAPA</div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={filteredMenuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="header site-layout-background">
          <div></div>
          <div className="header-content">
            <LanguageSwitcher />
            <Button icon={<SettingOutlined />} className="header-button" />
            <Button icon={<BellOutlined />} className="header-button" />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="header-avatar">
                <Avatar icon={<UserOutlined />} />
                <span>{role}</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className="content">
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="exercises" element={<ExerciseMenu />}></Route>
            <Route path="blocs" element={<BlocMenu />}></Route>
            <Route path="sessions" element={<SessionMenu />}></Route>
            <Route path="cycles" element={<CycleMenu />}></Route>
            <Route path="phases" element={<PhaseMenu />}></Route>
            <Route path="programs" element={<ProgramMenu />}></Route>
            <Route path="patients" element={<PatientMenu role={role} />}></Route>
            <Route path="doctors" element={<DoctorMenu />}></Route>
            <Route path="doctor-patients/:id" element={<DoctorPatients />}></Route>
            <Route
              path="kinesiologists"
              element={<KinesiologistMenu />}
            ></Route>
            <Route
              path="kinesiologist-patients/:id"
              element={<KinesiologistPatients />}
            ></Route>
            <Route path="admins" element={<AdminMenu />}></Route>
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
