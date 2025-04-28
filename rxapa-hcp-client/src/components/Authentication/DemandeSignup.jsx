import React from "react";
import PropTypes from "prop-types"; // Linting
import { Input, Button, Row, Col, Form } from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";
import Constants from "../Utils/Constants";
import "./Auth.css";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import  { useState } from "react";


export default function DemandeSignup({ setIsDemandeSignup }) {
    const [accountType, setAccountType] = useState("");

  const { t } = useTranslation("Authentication");
  
  const { handleSubmit, control, setValue } = useForm({
  
  });
  const onSubmit = (data) => {
    console.log(data); // Ajout d'un console.log pour vérifier les données envoyées
    axios
      .post(`${Constants.SERVER_URL}/Demandesignup`, data)
      .then((res) => {
        setIsDemandeSignup(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
      });
  };

  function backToLogin() {
    setIsDemandeSignup(false);
  }

  return (
    <div className="auth-container">
      <Col span={9}>
        <div className="auth-form">
          <Row>
            <Col span={16}></Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <LanguageSwitcher
                iconStyle={{ color: "#3b0062" }}
                iconClassName="login-language-icon"
                labelColor={{ color: "#3b0062" }}
              />
            </Col>
          </Row>
          <Button
            onClick={backToLogin}
            type="primary"
            icon={<ArrowLeftOutlined />}
          >
            {t("button_back")}
          </Button>
          <Form onFinish={handleSubmit(onSubmit)}>
            <div className="input-element">
              <h5> Prenom du professionel</h5>
              <Controller
                name={"firstname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_firstname")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> Nom du professionel</h5>
              <Controller
                name={"lastname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_name")}
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> {t("title_email")}</h5>
              <Controller
                name={"email"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_email")}
                    type="email"
                    required
                  />
                )}
              />
            </div>

            <div className="input-element">
              <h5> Titre</h5>
              <Controller
                name={"lastname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_name")}
                    required
                  />
                )}
              />
            </div>
           
            <div className="input-element">
              <h5> Adresse</h5>
              <Controller
                name={"lastname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_name")}
                    required
                  />
                )}
              />
            </div>
            
            <div className="input-element">
              <h5>{t("title_phone_number")}</h5>
              <Controller
                name={"phoneNumber"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_phone_number")}
                    type="tel"
                    required
                  />
                )}
              />
            </div>


            <div className="input-element">

            <h5 >Milieux ou désirez utiliser </h5>

            <div style={{ display: "flex", gap: "20px" }}>
                <label>
                <input
                    type="radio"
                    value="prive"
                    checked={accountType === "prive"}
                    onChange={() => setAccountType("prive")}
                />
                Privé
                </label>

                <label>
                <input
                    type="radio"
                    value="public"
                    checked={accountType === "public"}
                    onChange={() => setAccountType("public")}
                />
                Public
                </label>
            </div>
            </div>


            <div className="input-element">
              <h5> raison de la demande </h5>
              <Controller
                name={"lastname"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder={t("placeholder_name")}
                    required
                  />
                )}
              />
            </div>
            

            <div className="input-element">
              <Button type="primary" htmlType="submit" icon={<CheckOutlined />}>
                envoyer la demande 
              </Button>
            </div>
          </Form>
        </div>
      </Col>
    </div>
  );
}
// For the PropTypes, we only need to check if the setIsSignup function is passed as a prop. (Sonarlint)
DemandeSignup.propTypes = {
    setIsDemandeSignup: PropTypes.func.isRequired,
};
