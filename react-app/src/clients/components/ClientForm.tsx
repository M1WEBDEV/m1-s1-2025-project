import { useEffect, useState } from "react";
import { Form, Input, Radio, Upload, message, Button } from "antd";
import type { FormInstance } from "antd/es/form";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { CreateClientModel } from "../ClientModel";

interface ClientFormProps {
  form: FormInstance<CreateClientModel>;
  initialValues?: Partial<CreateClientModel>;
}

type PictureSource = "url" | "upload";

export const ClientForm = ({ form, initialValues }: ClientFormProps) => {
  const [pictureSource, setPictureSource] = useState<PictureSource>("url");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      // Determine source based on whether it's a data URL or regular URL
      if (initialValues.pictureUrl?.startsWith("data:")) {
        setPictureSource("upload");
      } else {
        setPictureSource("url");
      }
    } else {
      form.resetFields();
      setPictureSource("url");
    }
    setFileList([]);
  }, [form, initialValues]);

  const handleUploadChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      return;
    }
    
    // Only allow one file
    const newFileList = info.fileList.slice(-1);
    setFileList(newFileList);
    
    // Convert file to data URL and set in form
    if (newFileList.length > 0 && newFileList[0].originFileObj) {
      const file = newFileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        form.setFieldValue("pictureUrl", dataUrl);
      };
      reader.onerror = () => {
        message.error("Failed to read file");
      };
      reader.readAsDataURL(file);
    } else {
      // Clear URL field when file is removed
      form.setFieldValue("pictureUrl", "");
    }
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }
    return false; // Prevent auto upload
  };

  const handleSourceChange = (e: any) => {
    const newSource = e.target.value;
    setPictureSource(newSource);
    
    // Clear the other field when switching
    if (newSource === "url") {
      setFileList([]);
    } else {
      form.setFieldValue("pictureUrl", "");
    }
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: "First name is required" }]}
      >
        <Input placeholder="Jane" />
      </Form.Item>
      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: "Last name is required" }]}
      >
        <Input placeholder="Doe" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email", message: "Enter a valid email address" }]}
      >
        <Input placeholder="jane@example.com" />
      </Form.Item>
      <Form.Item label="Avatar">
        <Radio.Group
          value={pictureSource}
          onChange={handleSourceChange}
          style={{ marginBottom: 16 }}
        >
          <Radio value="url">Avatar URL</Radio>
          <Radio value="upload">Upload from device</Radio>
        </Radio.Group>

        {pictureSource === "url" ? (
          <Form.Item
            name="pictureUrl"
            rules={[
              {
                type: "url",
                warningOnly: true,
                message: "Enter a valid image URL",
              },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="https://…" />
          </Form.Item>
        ) : (
          <Form.Item
            style={{ marginBottom: 0 }}
            rules={[
              {
                validator: () => {
                  if (fileList.length === 0 && !form.getFieldValue("pictureUrl")) {
                    return Promise.resolve(); // Optional field
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
        )}
      </Form.Item>
    </Form>
  );
};

export const useClientForm = () => Form.useForm<CreateClientModel>();


