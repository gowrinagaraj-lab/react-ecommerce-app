const Select = ({ label, id, name, error, layout = 'wrap', wrapperClassName, className, options = [], placeholder, children, ...props }) => {
  const inputId = id || name
  const selectEl = (
    <select id={inputId} name={name} className={error ? `${className || ''} error`.trim() : className} {...props}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {children}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )

  if (!label) return selectEl

  if (layout === 'group') {
    return (
      <div className={wrapperClassName || 'form-group'}>
        <label htmlFor={inputId}>{label}</label>
        {selectEl}
        {error && <span className="field-error">{error}</span>}
      </div>
    )
  }

  return (
    <label className={wrapperClassName}>
      {label}
      {selectEl}
    </label>
  )
}

export default Select
