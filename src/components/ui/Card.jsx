function Card({ children }) {
  return (
    <div
      style={{
        background: 'white',
        padding: '16px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}
    >
      {children}
    </div>
  )
}

export default Card