"use client";

import { Input, Modal, Form } from "antd";
import React from "react";

interface ModalCreateProductProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

export default function ModalCreateProduct({
  open,
  onCancel,
  onSubmit,
}: ModalCreateProductProps) {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Create Product"
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="product_title"
          label="Title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="product_price"
          label="Price"
          rules={[{ required: true }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item name="product_description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="product_category" label="Category">
          <Input />
        </Form.Item>
        <Form.Item name="product_image" label="Image URL">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
