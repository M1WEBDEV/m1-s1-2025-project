export interface ClientModel {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  pictureUrl?: string;
  salesCount?: number;
}

export interface CreateClientModel {
  firstName: string;
  lastName: string;
  email?: string;
  pictureUrl?: string;
}

export interface UpdateClientModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  pictureUrl?: string;
}


