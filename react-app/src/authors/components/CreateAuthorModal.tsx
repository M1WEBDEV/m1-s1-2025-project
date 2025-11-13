import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import type { Author } from "../AuthorModel";
import { PictureInput } from "../../shared/ui/PictureInput";

export interface CreateAuthorInput {
  name: string;
  pictureUrl?: string;
}

interface CreateAuthorModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateAuthorInput) => Promise<void> | void;
  initialValue?: Author | null;
  loading?: boolean;
}

export function CreateAuthorModal({
  open,
  onClose,
  onSubmit,
  initialValue,
  loading,
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

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      onClose();
    } catch (err) {
      // validation handled by AntD
    }
  };

  return (
    <Modal
      open={open}
      title={initialValue ? "Edit author" : "Create author"}
      onOk={handleOk}
      onCancel={onClose}
      okText={initialValue ? "Save changes" : "Create"}
      confirmLoading={loading}
    >
      <Form<CreateAuthorInput> layout="vertical" form={form}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Author name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Picture"
          name="pictureUrl"
        >
          <PictureInput />
        </Form.Item>
      </Form>
    </Modal>
  );
}
