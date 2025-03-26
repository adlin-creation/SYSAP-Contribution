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
    message
} from "antd";
import axios from "axios";
import Constants from "../Utils/Constants";
import useToken from "../Authentication/useToken";

function AddCaregiver({ patient, refetchPatients, onClose }) {
    const { t } = useTranslation();
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
                patientId: patient.id,
            };

            await axios.post(`${Constants.SERVER_URL}/add-caregiver`, payload, {
                headers: { Authorization: "Bearer " + token },
            });

            message.success(t("Caregiver added successfully"));
            refetchPatients();
            onClose(true);
        } catch (error) {
            console.error("Error adding caregiver:", error);
            message.error(error.response?.data?.message || t("Failed to add caregiver"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={t("Add Caregiver")}
            open={true}
            onCancel={() => onClose(false)}
            footer={[
                <Button key="cancel" onClick={() => onClose(false)}>
                    {t("Cancel")}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit(onSubmit)}
                >
                    {t("Submit")}
                </Button>,
            ]}
            width={800}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("First Name")}
                            validateStatus={errors.caregiverFirstName ? "error" : ""}
                            help={errors.caregiverFirstName?.message}
                        >
                            <Controller
                                name="caregiverFirstName"
                                control={control}
                                rules={{
                                    required: t("First name is required"),
                                    minLength: {
                                        value: 2,
                                        message: t("First name must be at least 2 characters"),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder={t("Enter caregiver's first name")}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("Last Name")}
                            validateStatus={errors.caregiverLastName ? "error" : ""}
                            help={errors.caregiverLastName?.message}
                        >
                            <Controller
                                name="caregiverLastName"
                                control={control}
                                rules={{
                                    required: t("Last name is required"),
                                    minLength: {
                                        value: 2,
                                        message: t("Last name must be at least 2 characters"),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder={t("Enter caregiver's last name")}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("Email")}
                            validateStatus={errors.caregiverEmail ? "error" : ""}
                            help={errors.caregiverEmail?.message}
                        >
                            <Controller
                                name="caregiverEmail"
                                control={control}
                                rules={{
                                    required: t("Email is required"),
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: t("Invalid email address"),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        {...field}
                                        placeholder={t("Enter caregiver's email")}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("Phone Number")}
                            validateStatus={errors.caregiverPhone ? "error" : ""}
                            help={errors.caregiverPhone?.message}
                        >
                            <Controller
                                name="caregiverPhone"
                                control={control}
                                rules={{
                                    required: t("Phone number is required"),
                                    pattern: {
                                        value: /^[0-9+\s-]{8,}$/,
                                        message: t("Invalid phone number"),
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder={t("Enter caregiver's phone number")}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={t("Relationship")}
                            validateStatus={errors.relationship ? "error" : ""}
                            help={errors.relationship?.message}
                        >
                            <Controller
                                name="relationship"
                                control={control}
                                rules={{
                                    required: t("Relationship is required"),
                                }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder={t("Select relationship")}
                                    >
                                        <Select.Option value="parent">
                                            {t("Parent")}
                                        </Select.Option>
                                        <Select.Option value="sibling">
                                            {t("Sibling")}
                                        </Select.Option>
                                        <Select.Option value="friend">
                                            {t("Friend")}
                                        </Select.Option>
                                        <Select.Option value="other">
                                            {t("Other")}
                                        </Select.Option>
                                    </Select>
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("Program")}
                            validateStatus={errors.program ? "error" : ""}
                            help={errors.program?.message}
                        >
                            <Controller
                                name="program"
                                control={control}
                                rules={{
                                    required: t("Program is required"),
                                }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        placeholder={t("Select program")}
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
                            label={t("Program Start Date")}
                            validateStatus={errors.programStart ? "error" : ""}
                            help={errors.programStart?.message}
                        >
                            <Controller
                                name="programStart"
                                control={control}
                                rules={{
                                    required: t("Start date is required"),
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        style={{ width: "100%" }}
                                        placeholder={t("Select start date")}
                                    />
                                )}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={t("Program End Date")}
                            validateStatus={errors.programEnd ? "error" : ""}
                            help={errors.programEnd?.message}
                        >
                            <Controller
                                name="programEnd"
                                control={control}
                                rules={{
                                    required: t("End date is required"),
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        {...field}
                                        style={{ width: "100%" }}
                                        placeholder={t("Select end date")}
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