import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '../api/client'
import { useAuth } from '../context/AuthContext'
import ProductForm from './ProductForm'
import Modal from './Modal'
import { Input, Select } from './form'
const PAGE_SIZE = 8

const SORT_CHOICES = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
  { value: 'name-desc', label: 'Name: Z–A' },
  { value: 'rating-desc', label: 'Top Rated' },
]

const INITIAL_FILTERS = {
  keyword: '',
  category: '',
  brand: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
}

const ProductList = () => {
  const { isAdmin, token } = useAuth()

  // `filters` is the working copy bound to inputs; `applied` is what we query
  // with (keyword / price only take effect on "Apply"; sort applies instantly).
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [applied, setApplied] = useState(INITIAL_FILTERS)
  const [page, setPage] = useState(1)

  const [data, setData] = useState({ items: [], page: 1, pages: 1, total: 0 })
  const [meta, setMeta] = useState({ categories: [], brands: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [showCreate, setShowCreate] = useState(false)
  const [editing, setEditing] = useState(null)

  const loadMeta = useCallback(() => {
    apiFetch('/products/meta')
      .then(setMeta)
      .catch(() => {})
  }, [])

  const loadProducts = useCallback(() => {
    setLoading(true)
    setError(null)
// return
    const params = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
      sort: applied.sort,
    })


    if (applied.keyword) params.set('keyword', applied.keyword)
    if (applied.category) params.set('category', applied.category)
    if (applied.brand) params.set('brand', applied.brand)
    if (applied.minPrice) params.set('minPrice', applied.minPrice)
    if (applied.maxPrice) params.set('maxPrice', applied.maxPrice)

    apiFetch(`/products?${params.toString()}`)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [applied, page])

  useEffect(() => {
    loadMeta()
  }, [loadMeta])

  useEffect(() => {
    // Data-fetch effect: re-runs when the applied filters or page change.
    // oxlint-disable-next-line react/set-state-in-effect
    loadProducts()
  }, [loadProducts])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApply = (e) => {
    e.preventDefault()
    setPage(1)
    setApplied(filters)
  }

  const handleReset = () => {
    setFilters(INITIAL_FILTERS)
    setApplied(INITIAL_FILTERS)
    setPage(1)
  }

  // Category / brand selects and sort feel better applied immediately.
  const handleInstant = (e) => {
    const { name, value } = e.target
    const next = { ...filters, [name]: value }
    setFilters(next)
    setApplied((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handleSaved = () => {
    setShowCreate(false)
    setEditing(null)
    loadMeta()
    loadProducts()
  }

  const handleCategoryCreated = (categoryName) => {
    setMeta((prev) => ({
      ...prev,
      categories: [...new Set([...prev.categories, categoryName])].sort(),
    }))
    loadMeta()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE', token })
      loadMeta()
      // stepping back a page if we just removed the last row on it
      if (data.items.length === 1 && page > 1) {
        setPage((p) => p - 1)
      } else {
        loadProducts()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="product-list">
      <div className="product-list-head">
        <h2>
          Products <span className="muted">({data.total})</span>
        </h2>
        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              if (showCreate || editing) {
                setShowCreate(false)
                setEditing(null)
              } else {
                setShowCreate(true)
              }
            }}
          >
            {showCreate || editing ? 'Close' : '+ Add product'}
          </button>
        )}
      </div>

      {isAdmin && (showCreate || editing) && (
        <Modal onClose={() => { setShowCreate(false); setEditing(null) }}>
          <ProductForm
            key={editing ? editing._id : 'create'}
            editing={editing}
            categories={meta.categories}
            onSaved={handleSaved}
            onCancel={() => { setShowCreate(false); setEditing(null) }}
            onCategoryCreated={handleCategoryCreated}
          />
        </Modal>
      )}

      <form className="filter-bar" onSubmit={handleApply}>
        <Input
          name="keyword"
          placeholder="Search by name"
          value={filters.keyword}
          onChange={handleFilterChange}
        />
        <Select
          name="category"
          value={filters.category}
          onChange={handleInstant}
          placeholder="All categories"
          options={meta.categories.map((c) => ({ value: c, label: c }))}
        />
        <Select
          name="brand"
          value={filters.brand}
          onChange={handleInstant}
          placeholder="All brands"
          options={meta.brands.map((b) => ({ value: b, label: b }))}
        />
        <Input
          name="minPrice"
          type="number"
          min="0"
          placeholder="Min $"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <Input
          name="maxPrice"
          type="number"
          min="0"
          placeholder="Max $"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
        <button type="submit">Apply</button>
        <button type="button" className="btn-secondary" onClick={handleReset}>
          Reset
        </button>

        <Select
          label="Sort"
          wrapperClassName="sort-control"
          name="sort"
          value={filters.sort}
          onChange={handleInstant}
          options={SORT_CHOICES}
        />
      </form>

      {error && <div className="form-message error">{error}</div>}

      {loading ? (
        <p className="muted">Loading products…</p>
      ) : data.items.length === 0 ? (
        <p className="muted">No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {data.items.map((p) => (
            <article key={p._id} className="product-card">
              {p.image ? (
                <img src={p.image} alt={p.name} loading="lazy" />
              ) : (
                <div className="product-card-noimg" />
              )}
              <div className="product-card-body">
                <h4>{p.name}</h4>
                <p className="muted">
                  {p.category}
                  {p.brand ? ` · ${p.brand}` : ''}
                </p>
                <div className="product-card-meta">
                  <span className="price">${p.price.toFixed(2)}</span>
                  <span className="rating">★ {p.rating.toFixed(1)}</span>
                </div>
                <p className={`stock ${p.countInStock === 0 ? 'out' : ''}`}>
                  {p.countInStock === 0
                    ? 'Out of stock'
                    : `${p.countInStock} in stock`}
                </p>
                {isAdmin && (
                  <div className="product-card-admin">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setShowCreate(false)
                        setEditing(p)
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ← Prev
        </button>
        <span>
          Page {data.page} of {data.pages}
        </span>
        <button
          type="button"
          disabled={page >= data.pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </section>
  )
}

export default ProductList
