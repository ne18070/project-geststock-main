import { hash, verify } from 'argon2';

export const hashPassword = async (password: string) => {
  try {
    const hashedPassword = await hash(password);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password', error);
    throw error;
  }
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await verify(hashedPassword, password);
  } catch (error) {
    console.error('Error verifying password', error);
    return false;
  }
};
