import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../api/client'

const toFormState = (product) => ({
  name: product?.name ?? '',
  description: product?.description ?? '',
  price: product?.price ?? '',
  category: product?.category ?? '',
  brand: product?.brand ?? '',
  countInStock: product?.countInStock ?? '',
  image: product?.image ?? '',
})

/**
 * Create / edit form for a product. Admin only.
 * Pass an `editing` product to switch to update mode; omit it to create.
 * The parent remounts this via a `key` so state resets cleanly between modes.
 */
const ProductForm = ({ editing, categories = [], onSaved, onCancel, onCategoryCreated }) => {
  const { token } = useAuth()
  const [form, setForm] = useState(() => toFormState(editing))
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [creatingCategory, setCreatingCategory] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateCategory = async () => {
    const name = newCategory.trim() 
    debugger
    if (!name) {
      setError('Enter a category name to create it')
      return
    }

    setError(null)
    setCreatingCategory(true)
    try {
      const category = await apiFetch('/categories', {
        method: 'POST',
        body: { name },
        token,
      })
      setForm((prev) => ({ ...prev, category: category.name }))
      setNewCategory('')
      onCategoryCreated?.(category.name)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || form.price === '' || !form.category.trim()) {
      setError('Name, price and category are required')
      return
    }

    const payload = {
      ...form,
      price: Number(form.price),
      countInStock: form.countInStock === '' ? 0 : Number(form.countInStock),
    }

    setSaving(true)
    try {
      const saved = editing
        ? await apiFetch(`/products/${editing._id}`, {
            method: 'PUT',
            body: payload,
            token,
          })
        : await apiFetch('/products', { method: 'POST', body: payload, token })
      onSaved(saved)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h3>{editing ? 'Edit product' : 'Add product'}</h3>

      <div className="product-form-grid">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} />
        </label>
        <label>
          Category
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label>
          Price
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={handleChange}
          />
        </label>
        <label>
          Brand
          <input name="brand" value={form.brand} onChange={handleChange} />
        </label>
        <label>
          Stock
          <input
            name="countInStock"
            type="number"
            min="0"
            value={form.countInStock}
            onChange={handleChange}
          />
        </label>
        <label>
          Image URL
          <input name="image" value={form.image} onChange={handleChange} />
        </label>
        <label className="product-form-wide">
          Description
          <textarea
            name="description"
            rows="2"
            value={form.description}
            onChange={handleChange}
          />
        </label>
        <div className="product-form-wide category-create">
          <label htmlFor="new-category">Create category</label>
          <div className="category-create-controls">
            <input
              id="new-category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Accessories"
              disabled={creatingCategory}
            />
            <button type="button" onClick={handleCreateCategory} disabled={creatingCategory}>
              {creatingCategory ? 'Creating...' : 'Create category'}
            </button>
          </div>
        </div>
      </div>

      {error && <div className="form-message error">{error}</div>}

      <div className="product-form-actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Update product' : 'Create product'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export default ProductForm
