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
import useToken from "./components/Authentication/useToken"; // Import du hook personnalisé
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
  const { t, i18n } = useTranslation(); // la fonction qu'on doit appliquer a la traduction
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useToken(); // Utilisation du hook personnalisé pour gérer le token

  const [selectedKey, setSelectedKey] = useState(location.pathname);
  const [role, setRole] = useState("");

  // -- Menu brut (avant filtrage)
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Construction du menu complet
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

  // Menu filtré final
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);

  // Gère RTL si langue arabe
  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  // Si on récupère un "role" depuis location.state (après login), on filtre
  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);

      const filterMenuItems = (items) => {
        return items
          .map((item) => {
            // Si l'item a des enfants (menu déroulant)
            if (item.children) {
              return {
                ...item,
                // On ré-appelle filterMenuItems pour ses enfants
                children: filterMenuItems(item.children),
              };
            }

            // CAS ADMIN: l'admin ne voit PAS l'onglet "admins"
            if (
              location.state.role === "admin" &&
              item.key === "/admins"
            ) {
              return null;
            }

            // CAS DOCTOR ou KINESIOLOGIST: ne voient PAS la section "healthcare-professional"
            if (
              (location.state.role === "doctor" ||
                location.state.role === "kinesiologist") &&
              (item.key === "healthcare-professional" ||
                item.key === "/doctors" ||
                item.key === "/kinesiologists" ||
                item.key === "/admins")
            ) {
              return null;
            }

            // Sinon, on garde l'item
            return item;
          })
          .filter((item) => item !== null); // Retire les null
      };

      setFilteredMenuItems(filterMenuItems(menuItems));
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
      onClick: handleLogout, // Ajoutez cette ligne pour la déconnexion
    },
  ];

  // Si pas de token => on va sur login
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
      <Sider className={`sider ${i18n.language === "ar" ? "sider-ar" : ""}`}>
        <div className="logo">RxAPA</div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={filteredMenuItems}
        />
      </Sider>
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
            <Route
              path="patients"
              element={<PatientMenu role={role} />}
            ></Route>
            <Route path="doctors" element={<DoctorMenu />}></Route>
            <Route
              path="doctor-patients/:id"
              element={<DoctorPatients />}
            ></Route>
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
