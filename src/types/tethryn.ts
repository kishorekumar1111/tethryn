export interface TethrynExperience {
  id?: string;
  authorId: string;
  templateId: string;
  slug: string;
  title: string;
  recipientName: string;
  senderName?: string;
  content: Record<string, any>;
  isPublished: boolean;
  views: number;
  createdAt: any;
  updatedAt: any;
  settings?: {
    password?: string;
    customDomain?: string;
  };
}
