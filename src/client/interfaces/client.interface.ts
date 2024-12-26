import {
  ForgotPasswordTemplate,
  ResetPasswordTemplate,
  VerifyEmailTemplate
} from '@/auth/interfaces/template.interface';
import { HomePageTemplate } from '@/models/pages/interfaces/template.interface';

export interface TemplateDataMap {
  verifyEmail: VerifyEmailTemplate;
  // forgotPassword: ForgotPasswordTemplate;
  resetPassword: ResetPasswordTemplate;
  home: HomePageTemplate;
  layout: any;
}

export const TEMPLATE_FILE_MAP: Record<keyof TemplateDataMap, string> = {
  verifyEmail: 'email-template/verifyEmail',
  // forgotPassword: 'email-template/forgotPassword',
  resetPassword: 'email-template/resetPassword',
  home: 'client/home',
  layout: 'client/layout'
};

export interface SectionContent {
  title?: string;
  text?: string;
  image_id?: number;
  link?: string;
  link_title?: string;
}

export interface IPopupQuery {
  rel: string;
  propertyId: string;
  targetId: string;
  orderType: string;
  term: string;
  auctionOfferId: string;
  email: string;
  phone: string;
}