function Button({ children, type = 'button', style, ...props }) {
  return (
    <button
      type={type}
      {...props}
      style={{
        padding: '8px 14px',
        borderRadius: '8px',
        border: 'none',
        background: '#2563eb',
        color: 'white',
        cursor: 'pointer',
        ...style
      }}
    >
      {children}
    </button>
  )
}

export default Button