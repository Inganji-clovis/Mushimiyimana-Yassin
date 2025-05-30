import { useState, useEffect } from 'react'
import './SparePartsTable.css'

function SparePartsTable() {
  const [spareParts, setSpareParts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchSpareParts = async () => {
    setLoading(true)
    setError('')
    try {
      const token = getToken()
      const response = await fetch('http://localhost:5000/api/spareparts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch spare parts')
      }
      
      const data = await response.json()
      setSpareParts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSpareParts()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this spare part?')) return

    try {
      const token = getToken()
    const response = await fetch(`http://localhost:5000/api/spareparts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) {
        throw new Error('Failed to delete spare part')
      }
      fetchSpareParts()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="spare-parts-table-container">
      {error && <div className="error-message">{error}</div>}
      
      <button onClick={fetchSpareParts} disabled={loading} className="refresh-button">
        {loading ? 'Loading...' : 'Refresh'}
      </button>

      <table className="spare-parts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spareParts.map((part) => (
            <tr key={part.id}>
              <td>{part.name}</td>
              <td>{part.description}</td>
              <td>{part.category}</td>
              <td>{part.quantity}</td>
              <td>${part.price.toFixed(2)}</td>
              <td>{part.supplier}</td>
              <td>
                <button 
                  onClick={() => handleDelete(part.id)} 
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SparePartsTable
