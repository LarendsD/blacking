import * as bcrypt from 'bcrypt';

export const encrypt = (value: string) => {
  return bcrypt.hashSync(value, 10);
};
