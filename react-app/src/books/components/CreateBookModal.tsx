import { useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal, Select } from "antd";
import type { FormInstance } from "antd/es/form";
import type { CreateBookModel, UpdateBookModel } from "../BookModel";
import { PictureInput } from "../../shared/ui/PictureInput";

type BookFormValues = CreateBookModel;

export interface CreateBookModalProps {
  open: boolean;
  mode: "create" | "edit";
  authors: { label: string; value: string }[];
  onClose: () => void;
  onSubmit: (values: CreateBookModel | UpdateBookModel) => Promise<void> | void;
  initialValues?: Partial<CreateBookModel>;
  loading?: boolean;
}

const setFormValues = (
  form: FormInstance<BookFormValues>,
  values?: Partial<CreateBookModel>,
) => {
  if (values) {
    form.setFieldsValue({
      title: values.title,
      authorId: values.authorId,
      yearPublished: values.yearPublished,
      picture: values.picture,
      description: values.description,
    });
  } else {
    form.resetFields();
  }
};

export const CreateBookModal = ({
  open,
  mode,
  authors,
  onClose,
  onSubmit,
  initialValues,
  loading,
}: CreateBookModalProps) => {
  const [form] = Form.useForm<BookFormValues>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormValues(form, initialValues);
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title={mode === "create" ? "Create book" : "Edit book"}
      open={open}
      okText={mode === "create" ? "Create" : "Save changes"}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => {
        void handleSubmit();
      }}
      okButtonProps={{ disabled: uploading }}
      confirmLoading={loading || uploading}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter book title" />
        </Form.Item>
        <Form.Item
          label="Author"
          name="authorId"
          rules={[{ required: true, message: "Select an author" }]}
        >
          <Select
            placeholder="Select author"
            options={authors}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          label="Year published"
          name="yearPublished"
          rules={[{ required: true, message: "Enter publication year" }]}
        >
          <InputNumber
            min={1400}
            max={new Date().getFullYear()}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          label="Cover"
          name="picture"
        >
          <PictureInput onUploadingChange={setUploading} />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Short synopsis" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

