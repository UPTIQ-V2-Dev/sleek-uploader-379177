import { Routes, Route } from 'react-router-dom';
import { UploadPage } from '@/pages/UploadPage';

export const App = () => {
    return (
        <Routes>
            <Route
                path='/'
                element={<UploadPage />}
            />
        </Routes>
    );
};
