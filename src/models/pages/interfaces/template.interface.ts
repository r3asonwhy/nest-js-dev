import { User } from "@/models/users/entities/user.entity";

export interface HomePageTemplate {
  title: string;
  menu: Array<{ title: string; link: string }>;
  layout: string;
  header_footer: {
    header_logo: string;
    footer_logo: string;
    address: string;
    copyright: string;
    phones: string[];
    schedule: string;
    social_network: Array<{ icon: string; link: string }>;
  };
  lang: string;
  user: User;
  content: Array<{ title: string; text: string }>;
}
