import { useState, useEffect } from "react";
import { Input, Upload, Radio, Space } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { http } from "../http";

type PictureInputMode = "url" | "file";

interface PictureInputProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export function PictureInput({
  value,
  onChange,
  onUploadingChange,
}: PictureInputProps) {
  const [mode, setMode] = useState<PictureInputMode>("url");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [urlValue, setUrlValue] = useState<string>("");

  useEffect(() => {
    if (value) {
      // Check if value is a data URL (base64) or regular URL
      if (value.startsWith("data:")) {
        setMode("file");
        // Create a file list item for display
        setFileList([
          {
            uid: "-1",
            name: "image",
            status: "done",
            url: value,
          },
        ]);
        setUrlValue("");
      } else {
        setMode("url");
        setUrlValue(value);
        setFileList([]);
      }
    } else {
      setUrlValue("");
      setFileList([]);
    }
  }, [value]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setUrlValue(newValue);
    // Only send non-empty strings, convert empty to undefined
    onChange?.(newValue.trim() ? newValue : undefined);
  };

  const handleFileChange: UploadProps["onChange"] = (info) => {
    const { fileList: newFileList } = info;
    setFileList(newFileList);

    if (newFileList.length === 0) {
      onChange?.(undefined);
      return;
    }

    const file = newFileList[0].originFileObj as File | undefined;
    if (file) {
      onUploadingChange?.(true);
      http
        .upload('/upload', file)
        .then((res: any) => {
          if (res && res.url) onChange?.(res.url);
          else onChange?.(undefined);
        })
        .catch(() => onChange?.(undefined))
        .finally(() => onUploadingChange?.(false));
    }
  };

  const handleModeChange = (e: any) => {
    const newMode = e.target.value;
    setMode(newMode);
    
    // Clear values when switching modes to avoid confusion
    if (newMode === "url") {
      setFileList([]);
      // Keep urlValue if it exists, but clear the form value if it was a base64
      if (value && !value.startsWith("data:")) {
        // Value is already a URL, keep it
        setUrlValue(value);
      } else {
        // Value was base64 or empty, clear it
        setUrlValue("");
        onChange?.(undefined);
      }
    } else {
      // Switching to file mode
      setUrlValue("");
      // Clear form value if it was a URL
      if (value && !value.startsWith("data:")) {
        onChange?.(undefined);
      }
      setFileList([]);
    }
  };

  const beforeUpload = () => {
    return false; // Prevent auto upload
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
      <Radio.Group
        value={mode}
        onChange={handleModeChange}
        style={{ width: "100%" }}
      >
        <Radio value="url">Picture URL</Radio>
        <Radio value="file" style={{ marginLeft: 16 }}>Upload from device</Radio>
      </Radio.Group>

      {mode === "url" ? (
        <Input
          placeholder="https://…"
          value={urlValue}
          onChange={handleUrlChange}
        />
      ) : (
        <Upload
          listType="picture-card"
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={beforeUpload}
          maxCount={1}
          accept="image/*"
          style={{ width: "100%" }}
        >
          {fileList.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              padding: "8px 4px"
            }}>
              <UploadOutlined style={{ 
                fontSize: 32, 
                color: "#1890ff", 
                marginBottom: 6,
                display: "block"
              }} />
              <div style={{ 
                color: "#262626", 
                fontSize: 12, 
                fontWeight: 500, 
                marginBottom: 2,
                lineHeight: "18px"
              }}>
                Click to upload
              </div>
              <div style={{ 
                color: "#8c8c8c", 
                fontSize: 11,
                lineHeight: "16px",
                marginBottom: 4
              }}>
                or drag and drop
              </div>
              <div style={{ 
                color: "#bfbfbf", 
                fontSize: 10,
                lineHeight: "14px"
              }}>
                JPG, PNG, GIF, WebP
              </div>
            </div>
          )}
        </Upload>
      )}
    </Space>
  );
}

