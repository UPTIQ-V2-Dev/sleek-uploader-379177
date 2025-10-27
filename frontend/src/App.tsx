import { Routes, Route, Navigate } from 'react-router-dom';
import { UploadPage } from '@/pages/UploadPage';
import { LoginPage } from '@/pages/LoginPage';
import { isAuthenticated } from '@/lib/api';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated() ? (
        children
    ) : (
        <Navigate
            to='/login'
            replace
        />
    );
};

export const App = () => {
    return (
        <Routes>
            <Route
                path='/login'
                element={
                    isAuthenticated() ? (
                        <Navigate
                            to='/'
                            replace
                        />
                    ) : (
                        <LoginPage />
                    )
                }
            />
            <Route
                path='/'
                element={
                    <ProtectedRoute>
                        <UploadPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
};
