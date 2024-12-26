import { User } from 'src/models/users/entities/user.entity';
import { faker } from '@faker-js/faker';
import { CodeType, UserRole } from '@/common/constants';

export const userFactory = (): Partial<User> => ({
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  full_name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: `+380${faker.string.numeric(9)}`,
  role: faker.helpers.arrayElement([UserRole.STAFF, UserRole.ADMIN]),
  status: faker.helpers.arrayElement(['Pending']),
  email_verified: faker.datatype.boolean(),
  confirmation_code: faker.string.uuid(),
  confirmation_code_type: CodeType.REGISTER,
  confirmation_code_expires: faker.date.future(),
});
