export const codeGenerator = () => {
    const letter = "Q";
    const numbers = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `${letter}${numbers}`;
}
export const codeOrderGenerator = () => {
    const letter = "OR";
    const numbers = Math.floor(Math.random() * 1000).toString().padStart(6, "0");
    // `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    return `${letter}-${numbers}`;
}