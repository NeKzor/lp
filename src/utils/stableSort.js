const stableSort = (array, order, orderBy) => {
    const desc = (a, b) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    };

    const cmp = order === 'desc' ? (a, b) => desc(a, b) : (a, b) => -desc(a, b);

    const sort = (a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    };

    return array
        .map((el, index) => [el, index])
        .sort(sort)
        .map((el) => el[0]);
};

export default stableSort;
