import { ClipLoader } from "react-spinners"

const Spinner = () => {
    return <div style={{ width: "100%", height: "calc(100% - 144px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <ClipLoader color="#21618c" size={70} cssOverride={{ borderWidth: "4px" }} />
    </div>
}

export default Spinner