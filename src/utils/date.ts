const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.RelativeTimeFormat("ja", { numeric: "auto" }).format(
        Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        "day"
    );
};

export { formatDate };