import { validatePlaca, validateNIT, validateEmail } from './validations';

export interface CSVRow {
  [key: string]: string | number;
}

export interface ProcessedVehiculo {
  placa: string;
  marca: string;
  tipoVehiculo: string;
  modelo: string;
  linea: string;
  kilometraje: number;
  tipoCombustible: string;
}

export interface ProcessedEmpresa {
  nit: string;
  razonSocial: string;
  tipoPersona: 'juridica' | 'natural';
  codigoVerificacion: string;
  nombreContacto: string;
  email: string;
  celular: string;
  telefono: string;
  cargo: string;
  direccion: string;
  parametroFacturacion: string;
  plazoFacturacion: number;
}

export interface ProcessingResult<T> {
  success: T[];
  errors: Array<{ row: number; data: any; error: string }>;
  totalProcessed: number;
}

export const processCSVFile = async (
  file: File,
  type: 'vehiculos' | 'empresas'
): Promise<ProcessingResult<any>> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    const result: ProcessingResult<any> = {
      success: [],
      errors: [],
      totalProcessed: 0
    };

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          result.errors.push({ row: 0, data: null, error: 'El archivo debe tener al menos una fila de encabezados y una fila de datos' });
          resolve(result);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Validar headers según el tipo
        const requiredHeaders = type === 'vehiculos' 
          ? ['placa', 'marca', 'tipo', 'modelo', 'linea', 'kilometraje', 'combustible']
          : ['nit', 'razonsocial', 'tipopersona', 'codigoverificacion', 'nombrecontacto', 'email', 'celular', 'telefono', 'cargo', 'direccion', 'parametrofacturacion', 'plazofacturacion'];

        const missingHeaders = requiredHeaders.filter(h => 
          !headers.some(header => header.includes(h))
        );

        if (missingHeaders.length > 0) {
          result.errors.push({ 
            row: 0, 
            data: null, 
            error: `Faltan las siguientes columnas: ${missingHeaders.join(', ')}` 
          });
          resolve(result);
          return;
        }

        // Procesar cada línea
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          result.totalProcessed++;
          const values = line.split(',').map(v => v.trim());
          const rowData: any = {};

          // Mapear valores a headers
          headers.forEach((header, index) => {
            rowData[header] = values[index] || '';
          });

          try {
            if (type === 'vehiculos') {
              const vehiculo = processVehiculoRow(rowData, i + 1);
              if (vehiculo) {
                result.success.push(vehiculo);
              }
            } else {
              const empresa = processEmpresaRow(rowData, i + 1);
              if (empresa) {
                result.success.push(empresa);
              }
            }
          } catch (error: any) {
            result.errors.push({ 
              row: i + 1, 
              data: rowData, 
              error: error.message 
            });
          }
        }

        resolve(result);
      } catch (error: any) {
        result.errors.push({ 
          row: 0, 
          data: null, 
          error: `Error procesando archivo: ${error.message}` 
        });
        resolve(result);
      }
    };

    reader.onerror = () => {
      result.errors.push({ 
        row: 0, 
        data: null, 
        error: 'Error leyendo el archivo' 
      });
      resolve(result);
    };

    reader.readAsText(file);
  });
};

const processVehiculoRow = (rowData: any, rowNumber: number): ProcessedVehiculo | null => {
  const errors: string[] = [];

  // Validar placa
  const placa = (rowData.placa || '').toString().toUpperCase();
  if (!validatePlaca(placa)) {
    errors.push('Placa inválida');
  }

  // Validar campos requeridos
  const marca = (rowData.marca || '').toString();
  if (!marca) errors.push('Marca es requerida');

  const modelo = (rowData.modelo || '').toString();
  if (!modelo) errors.push('Modelo es requerido');

  const linea = (rowData.linea || '').toString();
  if (!linea) errors.push('Línea es requerida');

  // Validar kilometraje
  const kilometraje = parseInt(rowData.kilometraje) || 0;
  if (kilometraje < 0) errors.push('Kilometraje debe ser mayor o igual a 0');

  // Validar tipo de combustible
  const combustible = (rowData.combustible || 'gasolina').toString().toLowerCase();
  const combustiblesValidos = ['gasolina', 'diesel', 'electrico', 'hibrido', 'gas'];
  if (!combustiblesValidos.includes(combustible)) {
    errors.push('Tipo de combustible inválido');
  }

  // Validar tipo de vehículo
  const tipo = (rowData.tipo || 'automovil').toString().toLowerCase();
  const tiposValidos = ['automovil', 'suv', 'van', 'bus', 'camion', 'moto'];
  if (!tiposValidos.includes(tipo)) {
    errors.push('Tipo de vehículo inválido');
  }

  if (errors.length > 0) {
    throw new Error(`Línea ${rowNumber}: ${errors.join(', ')}`);
  }

  return {
    placa,
    marca,
    tipoVehiculo: tipo,
    modelo,
    linea,
    kilometraje,
    tipoCombustible: combustible
  };
};

const processEmpresaRow = (rowData: any, rowNumber: number): ProcessedEmpresa | null => {
  const errors: string[] = [];

  // Validar NIT
  const nit = (rowData.nit || '').toString();
  if (!validateNIT(nit)) {
    errors.push('NIT inválido');
  }

  // Validar email
  const email = (rowData.email || '').toString();
  if (!validateEmail(email)) {
    errors.push('Email inválido');
  }

  // Validar campos requeridos
  const razonSocial = (rowData.razonsocial || '').toString();
  if (!razonSocial) errors.push('Razón social es requerida');

  const nombreContacto = (rowData.nombrecontacto || '').toString();
  if (!nombreContacto) errors.push('Nombre de contacto es requerido');

  const celular = (rowData.celular || '').toString();
  if (!celular) errors.push('Celular es requerido');

  const cargo = (rowData.cargo || '').toString();
  if (!cargo) errors.push('Cargo es requerido');

  const direccion = (rowData.direccion || '').toString();
  if (!direccion) errors.push('Dirección es requerida');

  // Validar tipo de persona
  const tipoPersona = (rowData.tipopersona || 'juridica').toString().toLowerCase();
  if (!['juridica', 'natural'].includes(tipoPersona)) {
    errors.push('Tipo de persona debe ser "juridica" o "natural"');
  }

  // Validar plazo de facturación
  const plazoFacturacion = parseInt(rowData.plazofacturacion) || 30;
  if (plazoFacturacion < 1 || plazoFacturacion > 365) {
    errors.push('Plazo de facturación debe estar entre 1 y 365 días');
  }

  if (errors.length > 0) {
    throw new Error(`Línea ${rowNumber}: ${errors.join(', ')}`);
  }

  return {
    nit,
    razonSocial,
    tipoPersona: tipoPersona as 'juridica' | 'natural',
    codigoVerificacion: (rowData.codigoverificacion || '').toString(),
    nombreContacto,
    email,
    celular,
    telefono: (rowData.telefono || '').toString(),
    cargo,
    direccion,
    parametroFacturacion: (rowData.parametrofacturacion || 'Mensual').toString(),
    plazoFacturacion
  };
};

export const generateCSVTemplate = (type: 'vehiculos' | 'empresas'): string => {
  if (type === 'vehiculos') {
    return 'placa,marca,tipo,modelo,linea,kilometraje,combustible\nABC123,Toyota,automovil,2023,Corolla,15000,gasolina\nXYZ789,Honda,suv,2022,CR-V,25000,diesel';
  } else {
    return 'nit,razonsocial,tipopersona,codigoverificacion,nombrecontacto,email,celular,telefono,cargo,direccion,parametrofacturacion,plazofacturacion\n900123456,Empresa Ejemplo,juridica,123,Juan Pérez,juan@empresa.com,3001234567,4441234,Gerente,Calle 123,Medellín,Mensual,30';
  }
};

export const downloadCSVTemplate = (type: 'vehiculos' | 'empresas'): void => {
  const template = generateCSVTemplate(type);
  const blob = new Blob([template], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `template_${type}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}; 