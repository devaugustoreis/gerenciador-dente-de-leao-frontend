const topBarStyle: React.CSSProperties = {
    width: "100%",
    height: "60px",
    backgroundColor: "var(--moss-green)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    color: "#fff",
    lineHeight: "2.4rem",
    fontSize: "2rem"
};

const currentDate = (): string => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");

    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());

    return `${day}/${month}/${year} às ${hours}:${minutes}`;
};

const TopBar = () => {
    return (
        <header style={topBarStyle}>
            CRO20623 - DRA. ALESSANDRA DA COSTA - {currentDate()}
        </header>
    )
}

export default TopBar