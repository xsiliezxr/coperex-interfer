export const buildCompanyQuery = (query) => {
    const { page = 1, limit = 10, category, yearsTrayectory, sort } = query;
    
    const filter = { isActive: true };
    if (category) filter.category = category;
    if (yearsTrayectory) filter.yearsTrayectory = parseInt(yearsTrayectory);

    let sortOptions = { createdAt: -1 };
    if (sort === 'A-Z') sortOptions = { name: 1 };
    if (sort === 'Z-A') sortOptions = { name: -1 };

    return { 
        filter, 
        sortOptions, 
        page: parseInt(page), 
        limit: parseInt(limit) 
    };
};