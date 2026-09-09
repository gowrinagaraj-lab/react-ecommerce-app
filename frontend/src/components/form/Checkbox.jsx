const Checkbox = ({ label, wrapperClassName, ...props }) => (
  <label className={`checkbox-field ${wrapperClassName || ''}`.trim()}>
    <input type="checkbox" {...props} />
    {label}
  </label>
) 

export default Checkbox
