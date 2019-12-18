exports.create_milisec = () => {
    const milisec = (new Date()).getTime().toString();
    return Number(milisec.substring(0, milisec.length - 3));
}

exports.merge = (a1, a2) =>
    a1.map(itm => ({
        ...a2.find((item) => (item.id === itm.id) && item),
        ...itm
    }));