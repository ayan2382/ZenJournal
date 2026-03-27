import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({children, requireAuthentication = true}) => {
    const {isSignedIn} = useSelector((state) => state.auth);
    const location = useLocation();

    if (requireAuthentication && !isSignedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (!requireAuthentication && isSignedIn) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default ProtectedRoute;