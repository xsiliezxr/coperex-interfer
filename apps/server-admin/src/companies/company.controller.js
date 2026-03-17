import Company from './company.model.js';
import { buildCompaniesExcel } from '../../helpers/excel-generator.js';

export const createCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({
            success: true,
            message: 'Empresa creada exitosamente',
            data: company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la empresa',
            error: error.message
        });
    }
};

export const getCompanies = async (req, res) => {
    try {
        const { page = 1, limit = 10, isActive = true } = req.query;

        const filter = { isActive };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        }

        const companies = await Company.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort(options.sort);

        const total = await Company.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: companies,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                limit
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las empresas',
            error: error.message
        });
    }
};

export const getCompanyById = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.company
    });
};

export const updateCompany = async (req, res) => {
    try {

        const { isActive, ...company } = req.body;

        Object.assign(req.company, company);
        await req.company.save();

        res.status(200).json({
            success: true,
            message: 'Empresa actualizada',
            data: req.company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar',
            error: error.message
        });
    }
};

export const changeCompanyStatus = async (req, res) => {
    try {
        const { isActive } = req.body;
        Object.assign(req.company, { isActive });
        await req.company.save();

        res.status(200).json({
            success: true,
            message: `Empresa ${isActive ? 'activada' : 'desactivada'} exitosamente`,
            data: req.company
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar el estado de la empresa',
            error: error.message
        });
    }
};

export const generateExcelReport = async (req, res) => {
    try {
        // 1. Obtener todas las empresas (puedes ordenarlas de la A-Z por defecto)
        const companies = await Company.find().sort({ nombre: 1 });

        // 2. Llamar al helper
        const workbook = await buildCompaniesExcel(companies);

        // 3. Configurar headers para descarga
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Empresas_Interfer.xlsx');

        // 4. Escribir y enviar
        await workbook.xlsx.write(res);
        res.status(200).end();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar el reporte',
            error: error.message
        });
    }
};