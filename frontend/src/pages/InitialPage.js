import React from "react";
import { Row, Col } from "antd";

const InitialPage = () => {
  return (
    <Row className="flex justify-center items-center">
      <Col span={8}>col-8</Col>
      <Col span={8}>col-8</Col>
      <Col span={8}>col-8</Col>
    </Row>
  );
};

export default InitialPage;
