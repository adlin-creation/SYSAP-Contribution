import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import gbFlag from "../../images/flags/gb.svg";
import frFlag from "../../images/flags/fr.svg";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang) => {
    if (lang) {
      i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    }
    setAnchorEl(null);
  };

  return (
    <>
      {/* Icône de langue pour ouvrir le menu */}
      <IconButton
        onClick={handleClick}
        sx={{ color: "white", marginRight: "1em" }}
      >
        <LanguageIcon />
      </IconButton>

      {/* Menu déroulant avec les langues */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        marginThreshold={0}
        sx={{ mt: 0.3, ml: -2 }} // Rapproche le menu du bouton
        disableScrollLock // empêche la disparition du Scroll lors de l'affichage de ce Menu
      >
        <MenuItem onClick={() => handleClose("en")}>
          <img
            src={gbFlag}
            alt="English"
            width="20"
            style={{ marginRight: 8 }}
          />
          English
        </MenuItem>
        <MenuItem onClick={() => handleClose("fr")}>
          <img
            src={frFlag}
            alt="Français"
            width="20"
            style={{ marginRight: 8 }}
          />
          Français
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
