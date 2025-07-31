// Validaciones para documentos colombianos

export const validateNIT = (nit: string): boolean => {
  // Validación básica: solo números, entre 8 y 10 dígitos
  const nitRegex = /^\d{8,10}$/;
  return nitRegex.test(nit);
};

export const validateCedula = (cedula: string): boolean => {
  // Validación de cédula colombiana: 8-10 dígitos
  const cedulaRegex = /^\d{8,10}$/;
  return cedulaRegex.test(cedula);
};

export const validatePlaca = (placa: string): boolean => {
  // Formato colombiano: 3 letras + 3 números o 3 letras + 2 números + 1 letra
  const placaRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{3}\d{2}[A-Z]$/;
  return placaRegex.test(placa.toUpperCase());
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Formato colombiano: 10 dígitos
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateLicense = (license: string): boolean => {
  // Formato de licencia colombiana: letras y números
  const licenseRegex = /^[A-Z0-9]{6,12}$/;
  return licenseRegex.test(license.toUpperCase());
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const validateDocumentNumber = (document: string, type: 'cedula' | 'nit' | 'licencia'): boolean => {
  switch (type) {
    case 'cedula':
      return validateCedula(document);
    case 'nit':
      return validateNIT(document);
    case 'licencia':
      return validateLicense(document);
    default:
      return false;
  }
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'La contraseña es demasiado larga' };
  }
  return { isValid: true, message: '' };
}; 