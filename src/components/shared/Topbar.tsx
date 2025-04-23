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


const TopBar = () => {
    return (
        <header style={topBarStyle}>
            CRO20623 - DRA. ALESSANDRA DA COSTA - 31/01/2025 às 09:12
        </header>
    )
}

export default TopBar