import exceljs from 'exceljs';

export const buildCompaniesExcel = async (companies) => {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Empresas Interfer');

    // Estilo básico para los encabezados
    worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Categoría', key: 'categoria', width: 25 },
        { header: 'Años de Trayectoria', key: 'aniosTrayectoria', width: 20 },
        { header: 'Nivel de Impacto', key: 'nivelImpacto', width: 20 },
        { header: 'Estado', key: 'estadoTexto', width: 15 }
    ];

    // Formatear los datos antes de insertarlos
    const rows = companies.map(company => ({
        nombre: company.nombre,
        categoria: company.categoria,
        aniosTrayectoria: company.aniosTrayectoria,
        nivelImpacto: company.nivelImpacto,
        estadoTexto: company.isActive ? 'Activo' : 'Inactivo'
    }));

    worksheet.addRows(rows);

    return workbook; // Devolvemos el libro de Excel construido
};