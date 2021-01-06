type OrderType = 'desc' | 'asc';

const stableSort = (array: any[], order: OrderType, orderBy: string) => {
    const desc = (a: any, b: any) => {
        if (b[orderBy] < a[orderBy]) return -1;
        if (b[orderBy] > a[orderBy]) return 1;
        return 0;
    };

    const cmp = order === 'desc' ? (a: any, b: any) => desc(a, b) : (a: any, b: any) => -desc(a, b);

    const sort = (a: any, b: any) => {
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
