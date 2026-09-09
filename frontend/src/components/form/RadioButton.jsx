const RadioButton = ({ label, wrapperClassName, ...props }) => (
  <label className={`radio-field ${wrapperClassName || ''}`.trim()}>
    <input type="radio" {...props} />
    {label}
  </label>
)

export default RadioButton
