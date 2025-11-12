// Import the book icon image from assets/images folder
// The book icon is located at: react-app/src/assets/images/book-icon.png
// Supported formats: .png, .svg, .jpg, .jpeg, .webp
// If you use a different format, update the import below (e.g., book-icon.svg)
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

