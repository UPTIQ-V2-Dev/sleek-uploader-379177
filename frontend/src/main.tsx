import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import { App } from './App.tsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000 // 5 minutes
        }
    }
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <App />
                <Toaster
                    position='top-center'
                    richColors
                />
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
