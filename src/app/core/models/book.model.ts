export interface Book {
  _id?: string;
  title: string;
  author: string;
  category: string;
  stock: number;
  available?: number;
  createdAt?: Date;
}

export interface BookResponse {
  success: boolean;
  message?: string;
  book?: Book;
  books?: Book[];
}
