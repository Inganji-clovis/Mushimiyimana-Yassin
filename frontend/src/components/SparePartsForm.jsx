import { useState } from 'react'
import './SparePartsForm.css'

function SparePartsForm() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    supplier: '',
    quantity: '',
    price: '',
    minStockLevel: '',
    reorderLevel: '',
    unit: '',
    status: 'active'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('http://localhost:5000/api/spareparts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add spare part')
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        supplier: '',
        quantity: '',
        price: '',
        minStockLevel: '',
        reorderLevel: '',
        unit: '',
        status: 'active'
      })
    } catch (error) {
      console.error('Error:', error.message)
      alert(error.message)
    }
  }

  return (
    <div className="spare-parts-form">
      <h3>Add New Spare Part</h3>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="supplier">Supplier:</label>
            <input
              type="text"
              id="supplier"
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="unit">Unit:</label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="minStockLevel">Min Stock Level:</label>
            <input
              type="number"
              id="minStockLevel"
              name="minStockLevel"
              value={formData.minStockLevel}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
          <div className="form-group">
            <label htmlFor="reorderLevel">Reorder Level:</label>
            <input
              type="number"
              id="reorderLevel"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              required
              min="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Add Spare Part</button>
      </form>
    </div>
  )
}

export default SparePartsForm
