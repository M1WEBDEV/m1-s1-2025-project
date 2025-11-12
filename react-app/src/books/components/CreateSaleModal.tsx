import { useEffect } from "react";
import { Modal, Form, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import type { CreateSaleModel } from "../../sales/SaleModel";

interface CreateSaleModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateSaleModel) => Promise<void> | void;
  clientOptions: { label: string; value: string }[];
  bookOptions: { label: string; value: string }[];
  defaultClientId?: string;
  defaultBookId?: string;
  submitting?: boolean;
}

export const CreateSaleModal = ({
  open,
  onClose,
  onSubmit,
  clientOptions,
  bookOptions,
  defaultClientId,
  defaultBookId,
  submitting,
}: CreateSaleModalProps) => {
  const [form] = Form.useForm<CreateSaleModel>();

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        clientId: defaultClientId,
        bookId: defaultBookId,
        date: dayjs(),
      });
    } else {
      form.resetFields();
    }
  }, [open, defaultClientId, defaultBookId, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    const payload: CreateSaleModel = {
      clientId: values.clientId,
      bookId: values.bookId,
      date: values.date
        ? dayjs(values.date).toISOString()
        : dayjs().toISOString(),
    };
    await onSubmit(payload);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Record sale"
      open={open}
      okText="Record sale"
      onOk={() => {
        void handleOk();
      }}
      confirmLoading={submitting}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Client"
          name="clientId"
          initialValue={defaultClientId}
          rules={[{ required: true, message: "Select a client" }]}
        >
          <Select
            placeholder="Select client"
            options={clientOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          label="Book"
          name="bookId"
          initialValue={defaultBookId}
          rules={[{ required: true, message: "Select a book" }]}
        >
          <Select
            placeholder="Select book"
            options={bookOptions}
            showSearch
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>
        <Form.Item
          label="Sale date"
          name="date"
          initialValue={dayjs()}
          rules={[{ required: true, message: "Select a sale date" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            disabledDate={(current) => current && current > dayjs().endOf("day")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};


