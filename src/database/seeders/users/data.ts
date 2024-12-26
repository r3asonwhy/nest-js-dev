import { userFactory } from "@/database/factories/users/factory";

export const initialUsers = [
  {
    first_name: 'Admin',
    last_name: 'User',
    full_name: 'Admin User',
    email: 'role_adm@mailinator.com',
    phone: '+380631234567',
    role: 'Admin',
    status: 'Pending',
    email_verified: true,
    confirmation_code: null,
    confirmation_code_type: null,
    confirmation_code_expires: null,
  },
  {
    first_name: 'John',
    last_name: 'Doe',
    full_name: 'John Doe',
    email: 'role_use@mailinator.com',
    phone: '+380661234567',
    role: 'Admin',
    status: 'Pending',
    email_verified: false,
    confirmation_code: null,
    confirmation_code_type: null,
    confirmation_code_expires: null,
  },
  ...Array.from({ length: 2 }, () => userFactory()),
];
