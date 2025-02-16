import { useState, useEffect } from "react";
import { Route, Routes, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

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
import EvaluationPACE from "./components/Evaluation/EvaluationPACE";
import EvaluationSearch from "./components/Evaluation/EvaluationSearch";

import useToken from "./components/Authentication/useToken"; // Import du hook personnalisé

import Constants from "./components/Utils/Constants";

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
  FormOutlined,  // Ajoutez cette ligne
} from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';


const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: '/exercises',
    icon: <AppstoreOutlined />,
    label: <Link to="/exercises">Exercises</Link>,
  },
  {
    key: '/blocs',
    icon: <BlockOutlined />,
    label: <Link to="/blocs">Blocs</Link>,
  },
  {
    key: '/sessions',
    icon: <CalendarOutlined />,
    label: <Link to="/sessions">Sessions</Link>,
  },
  {
    key: '/cycles',
    icon: <ClusterOutlined />,
    label: <Link to="/cycles">Cycles</Link>,
  },
  {
    key: '/phases',
    icon: <PartitionOutlined />,
    label: <Link to="/phases">Phases</Link>,
  },
  {
    key: '/programs',
    icon: <SettingOutlined />,
    label: <Link to="/programs">Programs</Link>,
  },
  {
    key: '/patients',
    icon: <UserOutlined />,
    label: <Link to="/patients">Patients</Link>,
  },
  {
    key: '/evaluations',
    icon: <FormOutlined />,
    label: <Link to="/evaluations">Évaluation</Link>,
  },
  {
    key: 'healthcare-professional',
    icon: <UsergroupAddOutlined />,
    label: 'Professionals',
    children: [
      {
        key: '/doctors',
        icon: <MedicineBoxOutlined />,
        label: <Link to="/doctors">Doctors</Link>,
      },
      {
        key: '/kinesiologists',
        icon: <HeartOutlined />,
        label: <Link to="/kinesiologists">Kinesiologists</Link>,
      },
      {
        key: '/admins',
        icon: <UserOutlined />,
        label: <Link to="/admins">Admins</Link>,
      },
    ],
  },
  // Ajoutez d'autres éléments de menu si nécessaire
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, setToken } = useToken(); // Utilisation du hook personnalisé pour gérer le token
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      console.log("Attempting to logout...");
      const response = await axios.post(`${Constants.SERVER_URL}/logout`);
      console.log("Logout response:", response);
  
      setToken(null); 
      console.log("Token after logout:", token);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const userMenuItems = [
    {
      key: '1',
      label: <Link to="/profile">Profile</Link>,
    },
    {
      key: '2',
      label: <Link to="/settings">Settings</Link>,
    },
    {
      key: '3',
      label: 'Logout',
      onClick: handleLogout, // Ajoutez cette ligne pour la déconnexion
    },
  ];

  if (!token) {
    return (
      <Content className="content">
        <Routes>
          <Route path="login" element={<Login setToken={setToken} />}></Route>
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </Content>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider className="sider">
        <div className="logo">RxAPA</div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="header site-layout-background">
          <div></div> {/* Empty div to align items to the right */}
          <div className="header-content">
            <Button icon={<SettingOutlined />} className="header-button" />
            <Button icon={<BellOutlined />} className="header-button" />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="header-avatar">
                <Avatar icon={<UserOutlined />} />
                <span>John Doe</span>
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
            <Route path="patients" element={<PatientMenu />}></Route>
            <Route path="doctors" element={<DoctorMenu />}></Route>
            <Route path="doctor-patients/:id" element={<DoctorPatients />}></Route>
            <Route path="kinesiologists" element={<KinesiologistMenu />}></Route>
            <Route path="kinesiologist-patients/:id" element={<KinesiologistPatients />}></Route>
            <Route path="admins" element={<AdminMenu />}></Route>
            <Route path="evaluations" element={<EvaluationSearch />}></Route>
            <Route path="evaluation-pace/:patientId" element={<EvaluationPACE />}></Route>
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
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