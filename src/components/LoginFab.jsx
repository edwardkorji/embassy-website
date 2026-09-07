import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

function LoginFab() {
  return (
    <Link to="/login" className="login-fab" aria-label="Staff login">
      <Lock size={18} />
      <span className="login-fab-label">Staff Login</span>
    </Link>
  );
}

export default LoginFab;
