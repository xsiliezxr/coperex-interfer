import Company from '../src/companies/company.model.js';
import { validateJWT } from '@coperex-interfer/shared';
import { checkValidators } from './checkValidators.js';
import { body,query } from 'express-validator';
export const validateCompanyExists = async (req, res, next) => {
    try {
        const { id } = req.params;

        // validar que el ID tenga un formato válido de MongoDB
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID de empresa no válido'
            });
        }

        const company = await Company.findById(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        // Si existe se guarda en req para que esté disponible en el siguiente middleware o controlador
        req.company = company;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al buscar la empresa',
            error: error.message
        });
    }
};

const categories = [
    'TECNOLOGIA',
    'ALIMENTOS_Y_BEBIDAS',
    'TEXTIL_Y_CALZADO',
    'AUTOMOTRIZ',
    'CONSTRUCCION',
    'SALUD_Y_BELLEZA',
    'HOGAR_Y_DECORACION',
    'ARTESANIAS',
    'AGROINDUSTRIA',
    'SERVICIOS_FINANCIEROS',
    'OTRO'
];
export const validateCreateCompany = [
    validateJWT,
    body('name')
        .notEmpty()
        .withMessage('El nombre de la empresa es obligatorio'),
    body('description')
        .notEmpty()
        .withMessage('La descripción de la empresa es obligatoria'),
    body('address')
        .notEmpty()
        .withMessage('La dirección de la empresa es obligatoria'),
    body('email')
        .isEmail()
        .withMessage('El correo electrónico no es válido'),
    body('phone')
        .matches(/^[0-9]{8,8}$/)
        .withMessage('El número de teléfono debe tener 8 dígitos'),
    body('levelImpact')
        .isIn(['LOW', 'MEDIUM', 'HIGH', 'EXCELLENT'])
        .withMessage('El nivel de impacto debe ser LOW, MEDIUM, HIGH o EXCELLENT'),
    body('yearsTrayectory')
        .isInt({ min: 0 })
        .withMessage('Los años de trayectoria deben ser un número entero no negativo'),
    body('category')
        .notEmpty()
        .withMessage('La categoría de la empresa es obligatoria')
        .isIn(categories)
        .withMessage(`La categoría debe ser una de las siguientes: ${categories.join(', ')}`),
    checkValidators
]

export const validateUpdateCompany = [
    validateJWT,
    body('name')
        .optional()
        .notEmpty()
        .withMessage('El nombre de la empresa no puede estar vacío'),
    body('description')
        .optional()
        .notEmpty()
        .withMessage('La descripción de la empresa no puede estar vacía'),
    body('address')
        .optional()
        .notEmpty()
        .withMessage('La dirección de la empresa no puede estar vacía'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('El correo electrónico no es válido'),
    body('phone')
        .optional()
        .matches(/^[0-9]{8,8}$/)
        .withMessage('El número de teléfono debe tener 8 dígitos'),
    body('levelImpact')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH', 'EXCELLENT'])
        .withMessage('El nivel de impacto debe ser LOW, MEDIUM, HIGH o EXCELLENT'),
    body('yearsTrayectory')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Los años de trayectoria deben ser un número entero no negativo'),
    body('category')
        .optional()
        .isIn(categories)
        .withMessage(`La categoría debe ser una de las siguientes: ${categories.join(', ')}`),
    checkValidators
]

export const validateChangeCompanyStatus = [
    validateJWT,
    body('isActive')
        .notEmpty()
        .withMessage('El estado de la empresa es obligatorio')
        .isBoolean()
        .withMessage('El estado de la empresa debe ser un valor booleano'),
    checkValidators
]

export const validateGetCompanies = [
    validateJWT,
    query('yearsTrayectory')
        .optional()
        .isNumeric()
        .withMessage('Los años deben ser un número'),
    query('sort')
        .optional()
        .isIn(['A-Z', 'Z-A'])
        .withMessage('Orden no válido'),
    checkValidators
]