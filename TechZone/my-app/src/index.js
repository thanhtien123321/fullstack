import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'antd/dist/reset.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import {  QueryClient , QueryClientProvider} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();
root.render(
  //<React.StrictMode>
  <QueryClientProvider client ={queryClient}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
    <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>
  //</React.StrictMode>
);
