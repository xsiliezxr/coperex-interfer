import Router from 'express';
import { createCompany, updateCompany, changeCompanyStatus, getCompanyById, getCompanies, generateExcelReport } from './company.controller.js';
import { validateCompanyExists, validateCreateCompany, validateUpdateCompany, validateChangeCompanyStatus } from '../../middlewares/validate-company.js';
import { validateJWT } from '@coperex-interfer/shared';

const router = Router();

router.use(validateJWT);

router.get('/report/excel', generateExcelReport);
router.get('/', getCompanies);
router.post('/', validateCreateCompany, createCompany);

router.get('/:id', validateCompanyExists, getCompanyById);
router.put('/:id', validateCompanyExists, validateUpdateCompany, updateCompany);
router.patch('/:id/status', validateCompanyExists, validateChangeCompanyStatus, changeCompanyStatus);

export default router;