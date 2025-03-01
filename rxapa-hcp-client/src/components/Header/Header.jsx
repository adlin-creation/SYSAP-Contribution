import FitbitIcon from "@mui/icons-material/Fitbit";
import "./Header.css";
import { Link } from "react-router-dom";

export default function AppHeader() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        <FitbitIcon style={{ margin: "0 10px" }} /> {"  "} GoldFit
      </Link>
      <ul>
        <Link to="/exercises">Exercises</Link>
        <Link to="/blocs">Blocs</Link>
        <Link to="/sessions">Sessions</Link>
        <Link to="/cycles">Cycles</Link>
        <Link to="/phases">Phases</Link>
        <Link to="/programs">Programs</Link>
        <Link to="/patients">Patients</Link>
      </ul>
    </nav>
  );
}
