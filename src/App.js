import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import * as htmlToImage from 'html-to-image';
import './App.css';

const classDivOptions = ['10-A', '10-B', '11-A', '11-B', '12-A', '12-B'];
const busRouteOptions = ['Route 1', 'Route 2', 'Route 3', 'Route 4'];
const allergyOptions = ['Peanuts', 'Gluten', 'Dairy', 'Soy', 'Eggs'];

function App() {
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    classDivision: classDivOptions[0],
    allergies: [],
    photo: null,
    rackNumber: '',
    busRoute: busRouteOptions[0]
  });

  const [previewData, setPreviewData] = useState(null);
  const [template, setTemplate] = useState('template1');
  const [savedCards, setSavedCards] = useState([]);

  const cardRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedCards');
    if (saved) {
      setSavedCards(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedCards', JSON.stringify(savedCards));
  }, [savedCards]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAllergies = (e) => {
    const options = [...e.target.selectedOptions].map(option => option.value);
    setFormData(prev => ({
      ...prev,
      allergies: options
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => ({
        ...prev,
        photo: ev.target.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPreviewData(formData);
    const newCard = { ...formData, id: Date.now() };
    setSavedCards(prev => [newCard, ...prev]);
  };

  const downloadPNG = () => {
    if (cardRef.current === null) return;
    htmlToImage.toPng(cardRef.current)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'student-id-card.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => console.error('Error exporting image:', err));
  };

  const sanitizedData = previewData
    ? (({ photo, ...rest }) => rest)(previewData)
    : {};

  const templateClass = template === 'template1' ? 'template1' : 'template2';

  return (
    <div className="container">
      <h1 className="header">Student ID Card Generator</h1>
      
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Roll Number:</label>
          <input 
            type="text" 
            name="rollNumber" 
            value={formData.rollNumber}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Class &amp; Division:</label>
          <select 
            name="classDivision" 
            value={formData.classDivision}
            onChange={handleChange}
          >
            {classDivOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Allergies:</label>
          <select 
            multiple
            value={formData.allergies}
            onChange={handleAllergies}
          >
            {allergyOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <small>Hold down Ctrl (Cmd on Mac) to select multiple options.</small>
        </div>
        <div className="form-group">
          <label>Photo Upload:</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handlePhotoUpload}
          />
          {formData.photo && (
            <img src={formData.photo} alt="Photo Preview" className="photo-preview" />
          )}
        </div>
        <div className="form-group">
          <label>Rack Number:</label>
          <input 
            type="text" 
            name="rackNumber" 
            value={formData.rackNumber}
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Bus Route Number:</label>
          <select 
            name="busRoute" 
            value={formData.busRoute}
            onChange={handleChange}
          >
            {busRouteOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-submit">Submit</button>
      </form>

      {previewData && (
        <>
      <div className="template-switcher">
      <label>Select Template:</label>
      <select 
        value={template} 
        onChange={(e) => setTemplate(e.target.value)}
      >
        <option value="template1">Template 1</option>
        <option value="template2">Template 2</option>
      </select>
    </div>
        <div className="id-card-section">
          <h2>ID Card Preview</h2>
          <div ref={cardRef} className={`id-card ${templateClass}`}>
            {/* Photo Section */}
            {previewData.photo && (
              <img src={previewData.photo} alt="Student" className="card-photo" />
            )}
            <p><strong>Name:</strong> {previewData.name}</p>
            <p><strong>Roll Number:</strong> {previewData.rollNumber}</p>
            <p><strong>Class &amp; Division:</strong> {previewData.classDivision}</p>
            <p><strong>Rack Number:</strong> {previewData.rackNumber}</p>
            <p><strong>Bus Route:</strong> {previewData.busRoute}</p>
            {previewData.allergies.length > 0 && (
              <p><strong>Allergies:</strong> {previewData.allergies.join(', ')}</p>
            )}
            <div className="qr-code">
              <QRCodeCanvas value={JSON.stringify(sanitizedData)} size={128} level="L" />
            </div>
          </div>
          <button onClick={downloadPNG} className="btn btn-download">
            Download as PNG
          </button>
        </div>
        </>
      )}

      {savedCards.length > 0 && (
        <div className="older-cards">
          <h2>Previously Generated Cards</h2>
          <div className="cards-grid">
            {savedCards.map(card => (
              <div key={card.id} className="card-item">
                <p className="card-header">{card.name} ({card.rollNumber})</p>
                <button 
                  onClick={() => {
                    const node = document.createElement('div');
                    node.className = `id-card ${templateClass} card-export`;
                    node.innerHTML = `
                      <p><strong>Name:</strong> ${card.name}</p>
                      <p><strong>Roll Number:</strong> ${card.rollNumber}</p>
                      <p><strong>Class &amp; Division:</strong> ${card.classDivision}</p>
                      <p><strong>Rack Number:</strong> ${card.rackNumber}</p>
                      <p><strong>Bus Route:</strong> ${card.busRoute}</p>
                      ${card.allergies.length ? `<p><strong>Allergies:</strong> ${card.allergies.join(', ')}</p>` : ''}
                    `;
                    htmlToImage.toPng(node)
                      .then(dataUrl => {
                        const link = document.createElement('a');
                        link.download = `${card.name}_${card.rollNumber}_id-card.png`;
                        link.href = dataUrl;
                        link.click();
                      })
                      .catch(err => console.error(err));
                  }}
                  className="btn btn-download-small"
                >
                  Download Card
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
