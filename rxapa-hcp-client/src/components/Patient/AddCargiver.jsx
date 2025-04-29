import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Modal,
  message,
} from "antd";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";

function AddCaregiver({ patient, refetchPatients, onClose }) {
  const { t } = useTranslation("Patients");
  const { token } = useToken();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [programList, setProgramList] = useState([]);
  const [loading, setLoading] = useState(false);
  const programUrl = `${Constants.SERVER_URL}/programs`;

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data } = await axios.get(programUrl, {
          headers: { Authorization: "Bearer " + token },
        });
        setProgramList(data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };
    fetchPrograms();
  }, [token]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        caregiver: {
          firstname: data.caregiverFirstName,
          lastname: data.caregiverLastName,
          email: data.caregiverEmail,
          phoneNumber: data.caregiverPhone,
          relationship: data.relationship,
        },
        programEnrollment: {
          programId: data.program,
          startDate: data.programStart,
          endDate: data.programEnd,
        },
      };
      const response = await axios.post(
        `${Constants.SERVER_URL}/add-caregiver/${patient.id}`,
        payload,
        {
          headers: { Authorization: "Bearer " + token },
        }
      );
      message.success(t("success_caregiver_add"));
      refetchPatients();
      onClose(true);
    } catch (error) {
      console.error("Error adding caregiver:", error);
      message.error(
        t(`Backend:${error.response?.data?.message}`) ||
          t("error_caregiver_add")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("title_caregiver_add")}
      open={true}
      onCancel={() => onClose(false)}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)}>
          {t("button_cancel")}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          {t("button_submit")}
        </Button>,
      ]}
      width={800}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("label_first_name")}
              validateStatus={errors.caregiverFirstName ? "error" : ""}
              help={errors.caregiverFirstName?.message}
            >
              <Controller
                name="caregiverFirstName"
                control={control}
                rules={{
                  required: t("error_first_name_required"),
                  minLength: {
                    value: 2,
                    message: t("error_first_name_min_length"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("placeholder_caregiver_first_name")}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("label_last_name")}
              validateStatus={errors.caregiverLastName ? "error" : ""}
              help={errors.caregiverLastName?.message}
            >
              <Controller
                name="caregiverLastName"
                control={control}
                rules={{
                  required: t("error_last_name_required"),
                  minLength: {
                    value: 2,
                    message: t("error_last_name_min_length"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("placeholder_caregiver_last_name")}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("label_email")}
              validateStatus={errors.caregiverEmail ? "error" : ""}
              help={errors.caregiverEmail?.message}
            >
              <Controller
                name="caregiverEmail"
                control={control}
                rules={{
                  required: t("error_email_required"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("error_email_invalid"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    type="email"
                    {...field}
                    placeholder={t("placeholder_caregiver_email")}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("label_phone_number")}
              validateStatus={errors.caregiverPhone ? "error" : ""}
              help={errors.caregiverPhone?.message}
            >
              <Controller
                name="caregiverPhone"
                control={control}
                rules={{
                  required: t("error_phone_number_required"),
                  pattern: {
                    value: /^[0-9+\s-]{8,}$/,
                    message: t("error_phone_number_invalid"),
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder={t("placeholder_caregiver_phone")}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("label_relationship")}
              validateStatus={errors.relationship ? "error" : ""}
              help={errors.relationship?.message}
            >
              <Controller
                name="relationship"
                control={control}
                rules={{
                  required: t("error_relashionship_required"),
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={t("placeholder_relationship")}
                  >
                    <Select.Option value="parent">
                      {t("option_parentParent")}
                    </Select.Option>
                    <Select.Option value="sibling">
                      {t("option_sibling")}
                    </Select.Option>
                    <Select.Option value="option_friend">
                      {t("option_friend")}
                    </Select.Option>
                    <Select.Option value="other">
                      {t("option_other")}
                    </Select.Option>
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("label_program")}
              validateStatus={errors.program ? "error" : ""}
              help={errors.program?.message}
            >
              <Controller
                name="program"
                control={control}
                rules={{
                  required: t("error_program_required"),
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder={t("placeholder_program_selection")}
                    loading={programList.length === 0}
                  >
                    {programList.map((program) => (
                      <Select.Option key={program.id} value={program.id}>
                        {program.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={t("label_date_start")}
              validateStatus={errors.programStart ? "error" : ""}
              help={errors.programStart?.message}
            >
              <Controller
                name="programStart"
                control={control}
                rules={{
                  required: t("error_date_start_required"),
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    placeholder={t("placeholder_date_start")}
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("label_date_end")}
              validateStatus={errors.programEnd ? "error" : ""}
              help={errors.programEnd?.message}
            >
              <Controller
                name="programEnd"
                control={control}
                rules={{
                  required: t("error_date_end_required"),
                }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    style={{ width: "100%" }}
                    placeholder={t("placeholder_date_end")}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

AddCaregiver.propTypes = {
  patient: PropTypes.object.isRequired,
  refetchPatients: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired, // onClose should accept a success parameter
};

export default AddCaregiver;
