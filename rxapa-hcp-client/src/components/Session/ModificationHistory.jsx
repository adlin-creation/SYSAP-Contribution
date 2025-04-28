import React from 'react';

const ModificationHistory = ({ history }) => (
  <div className="modification-history">
    <h4>Historique des modifications</h4>
    {Array.isArray(history) && history.map((item, index) => (
      <div key={index}>
        <div>{item.date}</div>
        <div>Nom précédent: {item.previousName}</div>
        <div>Jour précédent: {item.previousDay}</div>
        <div>Description précédente: {item.previousDescription}</div>
        <div>Contraintes précédentes: {item.previousConstraints}</div>
      </div>
    ))}
  </div>
);

export default ModificationHistory; 