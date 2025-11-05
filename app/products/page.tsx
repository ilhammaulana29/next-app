"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Input,
  Button,
  Modal,
  Form,
  InputNumber,
  message,
  Space,
  Typography,
  Card,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import debounce from "lodash.debounce";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Title, Text } = Typography;

// Interfaces (Produk dan Produk list)
interface Product {
  product_id: string;
  product_title: string;
  product_price: number;
  product_description?: string;
  product_image?: string;
  product_category?: string;
  created_timestamp: string;
  updated_timestamp: string;
}

interface ProductListParams {
  page: number;
  limit: number;
  offset: number;
  search?: string;
}

// Component
export default function ProductPage() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [form] = Form.useForm();

  // Fetch data dari API (product)
  const fetchData = async (params: ProductListParams) => {
    setLoading(true);
    try {
      const res = await axios.get("/api/products", { params });
      setData(res.data.data || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
      message.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Debounced Fetch (buat delay pencarian)
  const debouncedFetch = useCallback(
    debounce((page: number, search: string) => {
      const params: ProductListParams = {
        page,
        limit,
        offset: (page - 1) * limit,
        search,
      };
      fetchData(params);
    }, 300),
    [limit]
  );

  useEffect(() => {
    debouncedFetch(page, search);
    return () => debouncedFetch.cancel();
  }, [page, search, debouncedFetch]);

  // Table Columns
  const columns: ColumnsType<Product> = [
    {
      title: "Title",
      dataIndex: "product_title",
      render: (text, record) => (
        <Space>
          {record.product_image && (
            <img
              src={record.product_image}
              alt={record.product_title}
              className="w-10 h-10 rounded-md object-cover shadow-sm"
            />
          )}
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "product_price",
      render: (price) => (
        <Text type="success">Rp {price.toLocaleString("id-ID")}</Text>
      ),
    },
    {
      title: "Category",
      dataIndex: "product_category",
      render: (category) =>
        category ? <Tag color="blue">{category}</Tag> : <Tag>None</Tag>,
    },
    {
      title: "Description",
      dataIndex: "product_description",
      render: (text) =>
        text ? text.slice(0, 50) + (text.length > 50 ? "..." : "") : "-",
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <>
        
        <Button
          icon={<EditOutlined />}
          onClick={() => openModal("edit", record)}
          type="link"
        >
          Edit
        </Button>
        <Button
          icon={<DeleteOutlined />}
          type="link"
          danger
        >
          Delete
        </Button>
        </>
      ),
    },
  ];

  // Modal Handlers
  const openModal = (type: "create" | "edit", record?: Product) => {
    setModalType(type);
    setSelectedProduct(record || null);
    form.resetFields();
    if (type === "edit" && record) form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === "create") {
        await axios.post("/api/product", values);
        message.success("Product created successfully");
      } else if (modalType === "edit" && selectedProduct) {
        await axios.put("/api/product", { ...selectedProduct, ...values });
        message.success("Product updated successfully");
      }
      debouncedFetch(page, search);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error("Action failed");
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card
        className="shadow-md rounded-2xl"
        bordered={false}
        style={{ background: "white" }}
      >
        <Space className="flex justify-between mb-4" align="center">
          <Title level={3} style={{ margin: 0 }}>
            🛍️ Product Management
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => openModal("create")}
            style={{ borderRadius: 8 }}
          >
            Add Product
          </Button>
        </Space>

        <Search
          placeholder="Search product..."
          allowClear
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          style={{
            width: 320,
            marginBottom: 20,
          }}
          className="shadow-sm"
        />

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: page,
            pageSize: limit,
            total,
            showSizeChanger: false,
            onChange: (p) => setPage(p),
          }}
          rowKey="product_id"
          className="rounded-xl shadow-sm"
        />
      </Card>

      <Modal
        title={modalType === "create" ? "Create Product" : "Edit Product"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleOk}
        okButtonProps={{ style: { borderRadius: 6 } }}
        cancelButtonProps={{ style: { borderRadius: 6 } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="product_title"
            label="Product Title"
            rules={[{ required: true, message: "Please enter product title" }]}
          >
            <Input placeholder="e.g. Baju Batik Premium" />
          </Form.Item>

          <Form.Item
            name="product_price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber className="w-full" min={0} prefix="Rp" />
          </Form.Item>

          <Form.Item name="product_description" label="Description">
            <Input.TextArea rows={3} placeholder="Product details..." />
          </Form.Item>

          <Form.Item name="product_category" label="Category">
            <Input placeholder="e.g. Fashion, Electronics, etc." />
          </Form.Item>

          <Form.Item name="product_image" label="Image URL">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
