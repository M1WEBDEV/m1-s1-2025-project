import { Avatar } from "antd";
import type { AvatarProps } from "antd";

interface AvatarImgProps extends Omit<AvatarProps, "src"> {
  name?: string;
  src?: string | null;
  size?: AvatarProps["size"];
}

const getInitials = (name?: string) => {
  if (!name) return "?";
  const [first = "", second = ""] = name.trim().split(" ");
  const initialA = first.charAt(0);
  const initialB = second.charAt(0);
  return `${initialA}${initialB}`.toUpperCase() || initialA.toUpperCase() || "?";
};

export const AvatarImg = ({ name, src, size = "large", ...rest }: AvatarImgProps) => {
  return (
    <Avatar
      src={src ?? undefined}
      size={size}
      style={{
        backgroundColor: "#d9d9d9",
        color: "#1f1f1f",
        fontWeight: 600,
        ...rest.style,
      }}
      {...rest}
    >
      {getInitials(name)}
    </Avatar>
  );
};


