import React from "react";
import ReactDom from "react-dom";
import "./Modal.css";

function Modal({ closeModal, message, isErrorMessage }) {
  return ReactDom.createPortal(
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button onClick={closeModal}>X</button>
        </div>
        {isErrorMessage ? (
          <div className="errorMessage">
            <p>{message}</p>
          </div>
        ) : (
          <div className="body">
            <p>{message}</p>
          </div>
        )}
        <div className="footer">
          {/* <button onClick={closeModal} id="cancelBtn">
            Cancel
          </button> */}
          <button onClick={closeModal}>OK</button>
        </div>
      </div>
    </div>,
    document.getElementById("portal")
  );
}

export default Modal;
