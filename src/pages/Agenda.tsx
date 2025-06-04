import SectionHeader from "@/components/shared/SectionHeader"

const Agenda = () => {
    const teste = () => {
        console.log("agenda")
    }

    return (
        <>
            <SectionHeader title="AGENDA" buttonLabel="Agendar Consulta" onClick={teste} />
            <p>Você acessou a agenda.</p>
        </>
    )
}

export default Agenda