const Textarea = ({ label, id, name, error, layout = 'wrap', wrapperClassName, className, ...props }) => {
  const inputId = id || name
  const textareaEl = (
    <textarea id={inputId} name={name} className={error ? `${className || ''} error`.trim() : className} {...props} />
  )

  if (!label) return textareaEl

  if (layout === 'group') {
    return (
      <div className={wrapperClassName || 'form-group'}>
        <label htmlFor={inputId}>{label}</label>
        {textareaEl}
        {error && <span className="field-error">{error}</span>}
      </div>
    )
  }

  return (
    <label className={wrapperClassName}>
      {label}
      {textareaEl}
    </label>
  )
}

export default Textarea
