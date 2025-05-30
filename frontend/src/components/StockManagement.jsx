import { useState } from 'react'
import './StockManagement.css'

function StockManagement() {
  const [formData, setFormData] = useState({
    sparePartId: '',
    quantity: '',
    type: 'in'
  })
  const [stockMovements, setStockMovements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [spareParts, setSpareParts] = useState([])

  const fetchSpareParts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/spareparts')
      if (!response.ok) {
        throw new Error('Failed to fetch spare parts')
      }
      const data = await response.json()
      setSpareParts(data)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchStockMovements = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('http://localhost:5000/api/stock')
      if (!response.ok) {
        throw new Error('Failed to fetch stock movements')
      }
      const data = await response.json()
      setStockMovements(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpareParts()
    fetchStockMovements()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update stock')
      }

      fetchStockMovements()
      setFormData({
        sparePartId: '',
        quantity: '',
        type: 'in'
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="stock-management-container">
      <div className="stock-form">
        <h3>Update Stock</h3>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="sparePartId">Spare Part:</label>
            <select
              id="sparePartId"
              name="sparePartId"
              value={formData.sparePartId}
              onChange={handleChange}
              required
            >
              <option value="">Select spare part</option>
              {spareParts.map(part => (
                <option key={part.id} value={part.id}>
                  {part.name} - {part.category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="in">In</option>
              <option value="out">Out</option>
            </select>
          </div>

          <button type="submit" className="submit-button">
            Update Stock
          </button>
        </form>
      </div>

      <div className="stock-movements">
        <h3>Stock Movements</h3>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Spare Part</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Updated By</th>
            </tr>
          </thead>
          <tbody>
            {stockMovements.map((movement) => (
              <tr key={movement.id}>
                <td>{new Date(movement.date).toLocaleDateString()}</td>
                <td>{movement.sparePart.name}</td>
                <td>{movement.quantity}</td>
                <td>{movement.type}</td>
                <td>{movement.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StockManagement
