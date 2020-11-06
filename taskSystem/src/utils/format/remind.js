
export function getFormDate(data) {
    switch (data.custom_type) {
        case 1 || 4 || 6:
            data.num = null;
            data.num_type = null;
            data.date = null;
            data.custom_hour = null;
            break;
        case 2 || 3 || 5 || 7:
            data.date = null;
            data.custom_hour = null;
            break;
        case 8:
            data.num = null;
            data.num_type = null;
            break;
    }
    return data;
}