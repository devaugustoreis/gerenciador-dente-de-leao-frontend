import { ClipLoader } from "react-spinners"

const Spinner = () => {
    return <div style={{ width: "100%", height: "calc(100% - 144px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ClipLoader color="var(--deep-blue)" size={70} cssOverride={{ borderWidth: "4px" }} />
    </div>
}

export default Spinner