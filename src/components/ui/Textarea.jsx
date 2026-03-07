function Textarea({ style, ...props }) {
  return (
    <textarea
      {...props}
      rows={4}
      style={{
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        width: '100%',
        marginTop: '4px',
        marginBottom: '12px',
        ...style
      }}
    />
  )
}

export default Textarea