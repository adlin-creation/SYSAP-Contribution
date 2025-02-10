import React from "react";
import "./Home.css";
import { Outlet } from "react-router-dom";
import Login from "../Authentication/Login";
import { Layout, Row, Col } from "antd";
import home_image from "./home.jpeg";
import useToken from "../Authentication/useToken";

const { Content } = Layout;

function Home() {
  const { token, setToken } = useToken();

  if (!token) {
    return (
      <Layout>
        <Content style={{ padding: '24px' }}>
          <Login setToken={setToken} />
        </Content>
      </Layout>
    );
  }
  return (
    <Layout>
      <Content style={{ padding: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="home_text_head">
              <h1>Welcome to SenFit Exercise Program Definition Page</h1>
            </div>
            <div className="home_text_body">
              <h4>
                Please navigate the appropriate tabs at the top of the page to
                define and update exercise programs.
              </h4>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <img src={home_image} alt="Home" className="home_image" />
          </Col>
        </Row>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default Home;
