import { SendOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Button,
  Form,
  Modal as AntModal,
  Radio,
  message,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";
import PropTypes from "prop-types";

function EvaluationPACE({ onSubmit }) {
  const { handleSubmit, control, getValues } = useForm({
    defaultValues: {
      // Section A
      chairTestSupport: true,
      chairTestCount: "",
      // Section B
      balanceFeetTogether: "",
      balanceSemiTandem: "",
      balanceTandem: "",
      balanceOneFooted: "",
      // Section C
      frtPosition: true,
      frtDistance: "",
      // Section D
      walkingTime: "",
    },
  });
  const { token } = useToken();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateChairTestScore = (support, count) => {
    const cnt = parseInt(count, 10);
    if (cnt === 0) return 0;
    if (support) {
      return cnt >= 10 ? 2 : 1;
    } else {
      if (cnt >= 16) return 6;
      if (cnt >= 13) return 5;
      if (cnt >= 10) return 4;
      if (cnt >= 5) return 3;
      if (cnt >= 1) return 2;
      return 0;
    }
  };

  const calculateBalanceScore = (
    feetTogether,
    semiTandem,
    tandem,
    oneFooted
  ) => {
    const ft = parseFloat(feetTogether) || 0;
    const st = parseFloat(semiTandem) || 0;
    const td = parseFloat(tandem) || 0;
    const of = parseFloat(oneFooted) || 0;
    if (of >= 10) return 6;
    if (of >= 5) return 5;
    if (td >= 10) return 4;
    if (td >= 5) return 3;
    if (st >= 10) return 2;
    if (ft >= 10) return 1;
    return 0;
  };

  const calculateMobilityScore = (frtPosition, frtDistance) => {
    // Si l'utilisateur ne lève pas les bras
    if (frtPosition === "armNotWorking") return 0;
    const distance = parseFloat(frtDistance) || 0;
    if (frtPosition === "standing") {
      if (distance > 35) return 6;
      if (distance >= 27) return 5;
      if (distance >= 15) return 4;
      if (distance > 0) return 3;
      return 0;
    }
    if (frtPosition === "sitting") {
      if (distance > 35) return 4;
      if (distance >= 27) return 3;
      if (distance >= 15) return 2;
      if (distance > 0) return 1;
      return 0;
    }
    return 0;
  };

  const determineLevel = (totalScore) => {
    if (totalScore >= 16) return "V";
    if (totalScore >= 13) return "IV";
    if (totalScore >= 9) return "III";
    if (totalScore >= 5) return "II";
    return "I";
  };

  const determineColor = (scoreA, scoreB, scoreC) => {
    const min = Math.min(scoreA, scoreB, scoreC);
    if (scoreA === scoreB && scoreB === scoreC) return "MARRON";
    if (scoreA === scoreB && scoreA === min) return "VERT";
    if (scoreB === scoreC && scoreB === min) return "ORANGE";
    if (scoreC === scoreA && scoreC === min) return "VIOLET";
    if (scoreA === min) return "BLEU";
    if (scoreB === min) return "JAUNE";
    if (scoreC === min) return "ROUGE";
    return "MARRON";
  };

  const calculateWalkingObjective = (walkingTime) => {
    const time = parseFloat(walkingTime);
    const speed = 4 / time;
    if (speed < 0.4) return 10;
    if (speed < 0.59) return 15;
    if (speed < 0.79) return 20;
    if (speed >= 0.8) return 30;
    return null;
  };

  const onFormSubmit = (data) => {
    const support = data.chairTestSupport;
    const count = data.chairTestCount;
    const scoreA = calculateChairTestScore(support, count);

    const scoreB = calculateBalanceScore(
      data.balanceFeetTogether,
      data.balanceSemiTandem,
      data.balanceTandem,
      data.balanceOneFooted
    );

    let position;
    if (data.frtPosition === true) position = true;
    else if (data.frtPosition === false) position = false;
    else position = data.frtPosition;

    const scoreC = calculateMobilityScore(position, data.frtDistance);
    const totalScore = scoreA + scoreB + scoreC;
    const level = determineLevel(totalScore);
    const color = determineColor(scoreA, scoreB, scoreC);
    const walkingSpeed = (4 / parseFloat(data.walkingTime)).toFixed(2);
    const walkingObjective = calculateWalkingObjective(data.walkingTime);

    const payload = {
      chairTestSupport: support ? true : false,
      chairTestCount: parseInt(data.chairTestCount, 10),
      balanceFeetTogether: parseInt(data.balanceFeetTogether, 10) || 0,
      balanceSemiTandem: parseInt(data.balanceSemiTandem, 10) || 0,
      balanceTandem: parseInt(data.balanceTandem, 10),
      balanceOneFooted: parseInt(data.balanceOneFooted, 10),
      frtPosition: position,
      frtDistance: parseInt(data.frtDistance, 10),
      walkingTime: data.walkingTime,
      scores: {
        cardioMusculaire: scoreA,
        equilibre: scoreB,
        mobilite: scoreC,
        total: totalScore,
        programme: `${color} ${level}`,
      },
    };

    const content = (
      <div>
        <h3>Confirmation des résultats</h3>
        <p>
          <strong>Score Total :</strong> {totalScore} / 18
        </p>
        <p>
          <strong>Niveau :</strong> {level}
        </p>
        <p>
          <strong>Programme recommandé :</strong> {color} {level}
        </p>
        <p>
          <strong>Vitesse de marche :</strong> {walkingSpeed} m/s
        </p>
        <p>
          <strong>Objectif de marche :</strong> {walkingObjective} minutes
        </p>
        <p>Voulez-vous enregistrer ces résultats ?</p>
      </div>
    );

    setModalContent(() => content);
    setIsOpenModal(true);
  };

  const confirmSubmit = async () => {
    setIsSubmitting(true);
    setIsOpenModal(false);
    const data = getValues();

    // Conversion de frtPosition pour correspondre au backend
    let position;
    if (data.frtPosition === true) {
      position = "sitting";
    } else if (data.frtPosition === false) {
      position = "standing";
    } else {
      position = "armNotWorking";
    }

    // Calcul des scores
    const support = data.chairTestSupport;
    const scoreA = calculateChairTestScore(support, data.chairTestCount);
    const scoreB = calculateBalanceScore(
      data.balanceFeetTogether,
      data.balanceSemiTandem,
      data.balanceTandem,
      data.balanceOneFooted
    );
    const scoreC = calculateMobilityScore(position, data.frtDistance);
    const totalScore = scoreA + scoreB + scoreC;
    const level = determineLevel(totalScore);
    const color = determineColor(scoreA, scoreB, scoreC);
    const walkingSpeed = parseFloat(data.walkingTime)
      ? (4 / parseFloat(data.walkingTime)).toFixed(2)
      : "0.00";
    const walkingObjective = calculateWalkingObjective(data.walkingTime);

    const payload = {
      // chairTestSupport reste un booléen - le backend l'acceptera
      chairTestSupport: support,
      chairTestCount: parseInt(data.chairTestCount, 10) || 0,
      balanceFeetTogether: parseInt(data.balanceFeetTogether, 10) || 0,
      balanceSemiTandem: parseInt(data.balanceSemiTandem, 10) || 0,
      balanceTandem: parseInt(data.balanceTandem, 10) || 0,
      balanceOneFooted: parseInt(data.balanceOneFooted, 10) || 0,
      frtPosition: position,
      frtDistance: parseInt(data.frtDistance, 10) || 0,
      walkingTime: data.walkingTime,
      scores: {
        cardioMusculaire: scoreA,
        equilibre: scoreB,
        mobilite: scoreC,
        total: totalScore,
        programme: `${color} ${level}`,
      },
    };

    try {
      console.log("Envoi des données:", payload);
      const response = await axios.post(
        `${Constants.SERVER_URL}/evaluation`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        message.success("Évaluation enregistrée avec succès !");
        if (onSubmit) onSubmit(payload);
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi des données :",
        error.response?.data || error
      );
      message.error(
        error.response?.data?.message ||
          "Échec de l'enregistrement, veuillez réessayer."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Row justify="center">
      <Col span={16}>
        <Form layout="vertical" onFinish={handleSubmit(onFormSubmit)}>
          <h2>A. CARDIO – MUSCULAIRE</h2>
          <Form.Item label="Test de la chaise en 30 secondes">
            <Controller
              name="chairTestSupport"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field}>
                  <Radio value={true}>Avec appui</Radio>
                  <Radio value={false}>Sans appui</Radio>
                </Radio.Group>
              )}
            />
          </Form.Item>
          <Form.Item
            label="Nombre de levers"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="chairTestCount"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Entrez le nombre"
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <h2>B. ÉQUILIBRE</h2>
          <Form.Item
            label="Temps Pieds joints (secondes)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="balanceFeetTogether"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Entrez le temps"
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Temps Semi-tandem (secondes)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="balanceSemiTandem"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Entrez le temps"
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Temps Tandem (secondes)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="balanceTandem"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Entrez le temps"
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Temps Unipodal (secondes)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="balanceOneFooted"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Entrez le temps"
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <h2>C. MOBILITÉ & STABILITÉ DU TRONC</h2>
          <Form.Item label="Functional Reach Test (FRT)">
            <Controller
              name="frtPosition"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field}>
                  <Radio value={true}>Assis</Radio>
                  <Radio value={false}>Debout</Radio>
                  <Radio value="armNotWorking">Ne lève pas les bras</Radio>
                </Radio.Group>
              )}
            />
          </Form.Item>
          <Form.Item
            label="Distance (cm)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="frtDistance"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Entrez la distance"
                  disabled={field.value === "armNotWorking"}
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <h2>D. VITESSE DE MARCHE</h2>
          <Form.Item
            label="Temps pour marcher 4m (secondes)"
            rules={[{ required: true, message: "Requis" }]}
          >
            <Controller
              name="walkingTime"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  placeholder="Temps en secondes"
                  status={error ? "error" : ""}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              disabled={isSubmitting}
            >
              Soumettre
            </Button>
          </Form.Item>
        </Form>

        <AntModal
          open={isOpenModal}
          onCancel={() => setIsOpenModal(false)}
          footer={[
            <Button key="close" onClick={() => setIsOpenModal(false)}>
              Fermer
            </Button>,
            <Button key="submit" type="primary" onClick={confirmSubmit}>
              Confirmer l'envoi
            </Button>,
          ]}
        >
          {modalContent}
        </AntModal>
      </Col>
    </Row>
  );
}

EvaluationPACE.propTypes = {
  onSubmit: PropTypes.func,
};

export default EvaluationPACE;
