import SectionHeader from "../components/shared/SectionHeader"

const MaterialSets = () => {
    const teste = () => {
        console.log("conjuntos")
    }

    return (
        <>
            <SectionHeader title="CONJUNTOS" buttonLabel="Novo Conjunto" onClick={teste} />
            <p>Você acessou os conjuntos.</p>
        </>
    )
}

export default MaterialSets