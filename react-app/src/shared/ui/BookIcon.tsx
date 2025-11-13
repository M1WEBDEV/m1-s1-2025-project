



import bookIconImage from "../../assets/images/book-icon.png";

interface BookIconProps {
  size?: number;
  style?: React.CSSProperties;
}

export const BookIcon = ({ size = 64, style }: BookIconProps) => {
  return (
    <img
      src={bookIconImage}
      alt="Book icon"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
        ...style,
      }}
    />
  );
};

