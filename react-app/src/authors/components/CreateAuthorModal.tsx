import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import type { Author } from "../AuthorModel";

export interface CreateAuthorInput {
  name: string;
  pictureUrl?: string;
}

interface CreateAuthorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAuthorInput) => void;
  initialValue?: Author | null;
}

export function CreateAuthorModal({
  open,
  onClose,
  onSubmit,
  initialValue,
}: CreateAuthorModalProps) {
  const [form] = Form.useForm<CreateAuthorInput>();

  useEffect(() => {
    if (open) {
      if (initialValue) {
        form.setFieldsValue({
          name: initialValue.name,
          pictureUrl: initialValue.pictureUrl ?? "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValue, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        onClose();
      })
      .catch(() => {});
  };

  return (
    <Modal
      open={open}
      title={initialValue ? "Edit author" : "Create author"}
      onOk={handleOk}
      onCancel={onClose}
      okText="Save"
    >
      <Form<CreateAuthorInput> layout="vertical" form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Author name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Picture URL" name="pictureUrl">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
