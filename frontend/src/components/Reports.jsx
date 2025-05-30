import { useState, useEffect } from 'react'
import './Reports.css'

function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    type: ''
  })

  const fetchReports = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`http://localhost:5000/api/reports?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }
      const data = await response.json()
      setReports(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="reports-container">
      <div className="filters">
        <h3>Filter Reports</h3>
        {error && <div className="error-message">{error}</div>}
        
        <div className="filter-group">
          <label htmlFor="startDate">Start Date:</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="endDate">End Date:</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="engine">Engine</option>
            <option value="brakes">Brakes</option>
            <option value="electrical">Electrical</option>
            <option value="suspension">Suspension</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>
        </div>

        <button onClick={fetchReports} className="filter-button">
          Apply Filters
        </button>
      </div>

      <div className="reports-table">
        <h3>Stock Report</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Spare Part</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Supplier</th>
              <th>Updated By</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{new Date(report.date).toLocaleDateString()}</td>
                <td>{report.sparePart.name}</td>
                <td>{report.sparePart.category}</td>
                <td>{report.quantity}</td>
                <td>{report.type}</td>
                <td>{report.sparePart.supplier}</td>
                <td>{report.updatedBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary">
        <h3>Summary</h3>
        <div className="summary-item">
          <span>Total Stock In:</span>
          <span>{reports.filter(r => r.type === 'in').reduce((sum, r) => sum + r.quantity, 0)}</span>
        </div>
        <div className="summary-item">
          <span>Total Stock Out:</span>
          <span>{reports.filter(r => r.type === 'out').reduce((sum, r) => sum + r.quantity, 0)}</span>
        </div>
        <div className="summary-item">
          <span>Total Value:</span>
          <span>${reports.reduce((sum, r) => sum + (r.sparePart.price * r.quantity), 0).toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default Reports
