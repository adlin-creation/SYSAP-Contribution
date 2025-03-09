import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, MenuItem, IconButton } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import Flag from "react-world-flags";

const LanguageSwitcher = ({ iconStyle, iconClassName, ...props }) => {
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
        className="language-switcher-icon"
        {...props}
      >
        <LanguageIcon style={iconStyle} className={iconClassName} />
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
        {" "}
        <MenuItem onClick={() => handleClose("fr")}>
          <Flag
            code="FR"
            style={{ width: 26, height: "auto", marginRight: 10 }}
          />{" "}
          Français
        </MenuItem>
        <MenuItem onClick={() => handleClose("en")}>
          <Flag
            code="GB"
            style={{ width: 26, height: "auto", marginRight: 10 }}
          />{" "}
          English
        </MenuItem>
        <MenuItem onClick={() => handleClose("ar")}>
          <Flag
            code="SA"
            style={{ width: 26, height: "auto", marginRight: 10 }}
          />{" "}
          عربي
        </MenuItem>
        <MenuItem onClick={() => handleClose("es")}>
          <Flag
            code="ES"
            style={{ width: 26, height: "auto", marginRight: 10 }}
          />{" "}
          Español
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
