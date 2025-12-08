interface ModalOverlayProps {
    onClose: () => void
}

const modalOverlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    backdropFilter: "blur(2px)"
}

const ModalOverlay = ({ onClose }: ModalOverlayProps) => {
    return <div style={modalOverlayStyle} onClick={onClose}></div>
}

export default ModalOverlay