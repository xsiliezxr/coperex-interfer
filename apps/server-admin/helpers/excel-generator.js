import exceljs from 'exceljs';

export const buildCompaniesExcel = async (companies) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Empresas Interfer');

    worksheet.columns = [
        { header: 'Nombre', key: 'name', width: 30 },
        { header: 'Categoría', key: 'category', width: 25 },
        { header: 'Años de Trayectoria', key: 'yearsTrayectory', width: 20 },
        { header: 'Nivel de Impacto', key: 'levelImpact', width: 20 },
        { header: 'Estado', key: 'isActive', width: 15 }
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF002060' } 
        };
        cell.font = {
            color: { argb: 'FFFFFFFF' },
            bold: true,
            size: 12
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });
    headerRow.height = 25;

    const rows = companies.map(company => ({
        name: company.name,
        category: company.category,
        yearsTrayectory: company.yearsTrayectory,
        levelImpact: company.levelImpact,
        isActive: company.isActive ? 'Activo' : 'Inactivo' 
    }));

    worksheet.addRows(rows);


    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    bottom: { style: 'thin', color: { argb: 'FFDDDDDD' } }
                };
            });
        }
    });

    worksheet.autoFilter = 'A1:E1';

    return workbook;
};