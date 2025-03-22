import FitbitIcon from "@mui/icons-material/Fitbit";
import "./Header.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AppHeader() {
  const { t } = useTranslation();
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <FitbitIcon style={{ margin: "0 10px" }} /> {"  "} GoldFit
      </Link>
      <ul>
        <Link to="/exercises">{t("App:exercises")}</Link>
        <Link to="/blocs">{t("App:blocs")}</Link>
        <Link to="/sessions">{t("App:sessions")}</Link>
        <Link to="/cycles">{t("App:cycles")}</Link>
        <Link to="/phases">{t("App:phases")}</Link>
        <Link to="/programs">{t("App:programs")}</Link>
        <Link to="/patients">{t("App:patients")}</Link>
      </ul>
    </nav>
  );
}
