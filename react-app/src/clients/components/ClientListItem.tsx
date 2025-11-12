import { Card, Space, Typography } from "antd";
import type { ClientModel } from "../ClientModel";
import { AvatarImg } from "../../shared/ui/AvatarImg";

interface ClientListItemProps {
  client: ClientModel;
  extra?: React.ReactNode;
  onClick?: () => void;
}

export const ClientListItem = ({ client, extra, onClick }: ClientListItemProps) => {
  const fullName = `${client.firstName} ${client.lastName}`.trim();

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ marginBottom: 16 }}
      bodyStyle={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      extra={extra}
    >
      <Space>
        <AvatarImg name={fullName} src={client.pictureUrl} />
        <div>
          <Typography.Text strong>{fullName}</Typography.Text>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
            {client.email ?? "No email provided"}
          </Typography.Paragraph>
        </div>
      </Space>
    </Card>
  );
};


