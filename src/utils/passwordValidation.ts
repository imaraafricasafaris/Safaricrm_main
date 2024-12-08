export interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

export const passwordRequirements: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    validator: (password: string) => password.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'Contains at least one uppercase letter',
    validator: (password: string) => /[A-Z]/.test(password),
  },
  {
    id: 'lowercase',
    label: 'Contains at least one lowercase letter',
    validator: (password: string) => /[a-z]/.test(password),
  },
  {
    id: 'number',
    label: 'Contains at least one number',
    validator: (password: string) => /\d/.test(password),
  },
  {
    id: 'special',
    label: 'Contains at least one special character',
    validator: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

export const validatePassword = (password: string): boolean => {
  return passwordRequirements.every((requirement) => requirement.validator(password));
};