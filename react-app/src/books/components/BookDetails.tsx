import { BookDetailsContent } from "../pages/BookDetailsPage";

interface BookDetailsProps {
  id: string;
}

export const BookDetails = ({ id }: BookDetailsProps) => {
  return <BookDetailsContent bookId={id} />;
};

