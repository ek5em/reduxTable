export const validateInput = (str: string) => {
    if (str.length > 1 && str[0] === "0") {
        str = str.slice(1);
    }
    return str.replace(/\D/g, "");
};
