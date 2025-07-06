import underConstruction from "@/assets/images/under-constuction.png";
import SectionHeader from "@/components/shared/SectionHeader"

const AppointmentFinalization = () => {
    return (
        <>
            <SectionHeader title="FINALIZAR CONSULTAS" />
            <div style={{ display: "flex", justifyContent: "center" }}>
                <img src={underConstruction} alt="Imagem website em construção" style={{ maxWidth: "100%", marginTop: "40px" }}/>
            </div>
        </>
    )
}

export default AppointmentFinalization