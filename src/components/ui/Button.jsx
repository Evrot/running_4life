function Button({ children, type = 'button', onClick }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: '8px 14px',
        borderRadius: '8px',
        border: 'none',
        background: '#2563eb',
        color: 'white',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}

export default Button