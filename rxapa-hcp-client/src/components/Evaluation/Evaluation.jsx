import React, { useState } from 'react';

const numericInputStyles = `w-full p-2 border rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`;

function KinesiologyEvaluation({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    // Section A
    chairTestSupport: 'with',
    chairTestCount: '',
    
    // Section B
    balanceFeetTogether: '',
    balanceSemiTandem: '',
    balanceTandem: '',
    balanceOneFooted: '',
    
    // Section C
    frtPosition: 'sitting',
    frtDistance: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    // Validation
    if (!formData.chairTestCount) {
      newErrors.chairTestCount = "Le nombre de levers est requis";
    } else if (isNaN(formData.chairTestCount) || formData.chairTestCount < 0) {
      newErrors.chairTestCount = "Veuillez entrer un nombre valide";
    }

    ['balanceFeetTogether', 'balanceSemiTandem', 'balanceTandem', 'balanceOneFooted'].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = "Le temps est requis";
      } else if (isNaN(formData[field]) || formData[field] < 0) {
        newErrors[field] = "Veuillez entrer un temps valide";
      }
    });

    if (!formData.frtDistance) {
      newErrors.frtDistance = "La distance est requise";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="container mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section A: CARDIO-MUSCULAIRE */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">A. CARDIO-MUSCULAIRE</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test de la chaise en 30 secondes
              </label>
              <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="chairTestSupport"
                    value="with"
                    checked={formData.chairTestSupport === 'with'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Avec appui</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="chairTestSupport"
                    value="without"
                    checked={formData.chairTestSupport === 'without'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Sans appui</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de levers
                </label>
                <input
                  type="number"
                  name="chairTestCount"
                  value={formData.chairTestCount}
                  onChange={handleChange}
                  min="0"
                  className={`${numericInputStyles} w-1/3 ${
                    errors.chairTestCount ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.chairTestCount && (
                  <p className="text-red-500 text-sm mt-1">{errors.chairTestCount}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section B: ÉQUILIBRE */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">B. ÉQUILIBRE</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temps Pieds joints (secondes)
              </label>
              <input
                type="number"
                name="balanceFeetTogether"
                value={formData.balanceFeetTogether}
                onChange={handleChange}
                min="0"
                step="0.1"
                className={`${numericInputStyles} ${
                  errors.balanceFeetTogether ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.balanceFeetTogether && (
                <p className="text-red-500 text-sm mt-1">{errors.balanceFeetTogether}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temps Semi-tandem (secondes)
              </label>
              <input
                type="number"
                name="balanceSemiTandem"
                value={formData.balanceSemiTandem}
                onChange={handleChange}
                min="0"
                step="0.1"
                className={`${numericInputStyles} ${
                  errors.balanceSemiTandem ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.balanceSemiTandem && (
                <p className="text-red-500 text-sm mt-1">{errors.balanceSemiTandem}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temps Tandem (secondes)
              </label>
              <input
                type="number"
                name="balanceTandem"
                value={formData.balanceTandem}
                onChange={handleChange}
                min="0"
                step="0.1"
                className={`${numericInputStyles} ${
                  errors.balanceTandem ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.balanceTandem && (
                <p className="text-red-500 text-sm mt-1">{errors.balanceTandem}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temps Unipodal (secondes)
              </label>
              <input
                type="number"
                name="balanceOneFooted"
                value={formData.balanceOneFooted}
                onChange={handleChange}
                min="0"
                step="0.1"
                className={`${numericInputStyles} ${
                  errors.balanceOneFooted ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.balanceOneFooted && (
                <p className="text-red-500 text-sm mt-1">{errors.balanceOneFooted}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section C: MOBILITÉ & STABILITÉ DU TRONC */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">C. MOBILITÉ & STABILITÉ DU TRONC</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Functional Reach Test (FRT)
              </label>
              <div className="flex items-center space-x-4 mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="frtPosition"
                    value="sitting"
                    checked={formData.frtPosition === 'sitting'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Assis</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="frtPosition"
                    value="standing"
                    checked={formData.frtPosition === 'standing'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Debout</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="frtPosition"
                    value="sitting"
                    checked={formData.frtPosition === 'armNotWorking'}
                    onChange={handleChange}
                    className="form-radio"
                  />
                  <span className="ml-2">Ne lève pas les bras</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (cm)
              </label>
              <input
                type="number"
                name="distanceFRT"
                value={formData.distanceFRT}
                onChange={handleChange}
                min="0"
                step="1"
                className={`${numericInputStyles} ${
                  errors.distanceFRT ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.distanceFRT && (
                <p className="text-red-500 text-sm mt-1">{errors.distanceFRT}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Soumettre
          </button>
        </div>
      </form>
    </div>
  );
}

export default KinesiologyEvaluation;