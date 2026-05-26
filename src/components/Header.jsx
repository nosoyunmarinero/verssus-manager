export default function Header({ mostrarReset, onReset }) {
  return (
    <header className="header-app">
      <div className="header-contenido">
        <span className="logo">🏆 Verssus Manager</span>
        {mostrarReset && (
          <button className="btn btn-danger btn-sm" onClick={onReset}>
            Reset Total
          </button>
        )}
      </div>
    </header>
  )
}