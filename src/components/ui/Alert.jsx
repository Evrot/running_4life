function Alert({ message }) {
  if (!message) return null

  return (
    <div
      style={{
        padding: '10px',
        background: '#fee2e2',
        color: '#991b1b',
        borderRadius: '6px',
        marginBottom: '12px'
      }}
    >
      {message}
    </div>
  )
}

export default Alert