import { useEffect, useState } from "react";
import { Modal, Form, Input, Radio, Upload, message, Button } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { Author } from "../AuthorModel";

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

type PictureSource = "url" | "upload";

export function CreateAuthorModal({
  open,
  onClose,
  onSubmit,
  initialValue,
  loading,
}: CreateAuthorModalProps) {
  const [form] = Form.useForm<CreateAuthorInput>();
  const [pictureSource, setPictureSource] = useState<PictureSource>("url");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (open) {
      if (initialValue) {
        form.setFieldsValue({
          name: initialValue.name,
          pictureUrl: initialValue.pictureUrl ?? "",
        });
        // Determine source based on whether it's a data URL or regular URL
        if (initialValue.pictureUrl?.startsWith("data:")) {
          setPictureSource("upload");
          // For data URLs, we can't restore the file, so just show URL mode
          // But if it's a data URL, keep it in upload mode
        } else {
          setPictureSource("url");
        }
      } else {
        form.resetFields();
        setPictureSource("url");
      }
      setFileList([]);
    }
  }, [open, initialValue, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // If using file upload, convert file to data URL
      if (pictureSource === "upload" && fileList.length > 0) {
        const file = fileList[0].originFileObj;
        if (file) {
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          values.pictureUrl = dataUrl;
        }
      }
      
      await onSubmit(values);
      onClose();
      // Reset form state
      setFileList([]);
      setPictureSource("url");
    } catch (err) {
      // validation handled by AntD
    }
  };

  const handleUploadChange: UploadProps["onChange"] = (info) => {
    if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
      return;
    }
    
    // Only allow one file
    const newFileList = info.fileList.slice(-1);
    setFileList(newFileList);
    
    // Clear URL field when file is selected
    if (newFileList.length > 0) {
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
          label="* Name"
          name="name"
          rules={[{ required: true, message: "Author name is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Picture">
          <Radio.Group
            value={pictureSource}
            onChange={handleSourceChange}
            style={{ marginBottom: 16 }}
          >
            <Radio value="url">Picture URL</Radio>
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
    </Modal>
  );
}
