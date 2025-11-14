import { useEffect } from "react";
import { Form, Input } from "antd";
import type { FormInstance } from "antd/es/form";
import type { CreateClientModel } from "../ClientModel";
import { PictureInput } from "../../shared/ui/PictureInput";

interface ClientFormProps {
  form: FormInstance<CreateClientModel>;
  initialValues?: Partial<CreateClientModel>;
  onUploadingChange?: (uploading: boolean) => void;
}

export const ClientForm = ({ form, initialValues, onUploadingChange }: ClientFormProps) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

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
      <Form.Item
        label="Avatar"
        name="picture"
      >
        <PictureInput onUploadingChange={onUploadingChange} />
      </Form.Item>
    </Form>
  );
};

export const useClientForm = () => Form.useForm<CreateClientModel>();


