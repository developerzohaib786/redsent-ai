export const validateProductTitle = (title: string): boolean => {
    const words = title.trim().split(/\s+/);
    return words.length <= 3;
};

export const getTitleErrorMessage = (title: string): string | null => {
    if (!title) {
        return "Product title is required.";
    }
    if (!validateProductTitle(title)) {
        return "Product title must be three words or less.";
    }
    return null;
};