const Input = ({ label, id, name, error, layout = 'wrap', wrapperClassName, className, ...props }) => {
  const inputId = id || name
  const inputEl = (
    <input id={inputId} name={name} className={error ? `${className || ''} error`.trim() : className} {...props} />
  )

  if (!label) return inputEl

  if (layout === 'group') {
    return (
      <div className={wrapperClassName || 'form-group'}>
        <label htmlFor={inputId}>{label}</label>
        {inputEl}
        {error && <span className="field-error">{error}</span>}
      </div>
    )
  }

  return (
    <label className={wrapperClassName}>
      {label}
      {inputEl}
    </label>
  )
}

export default Input
