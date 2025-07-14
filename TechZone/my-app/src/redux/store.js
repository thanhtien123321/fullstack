import { configureStore } from '@reduxjs/toolkit'
import  productReducer  from './slides/productSlide'
import userReducer from './slides/userSlide'
import orderReducer from './slides/orderSlide'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import { combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
    key : 'root',
    version : 1,
    storage,
    blacklist : ['product' ]
}

const rootReducer = combineReducers({
        product : productReducer , 
        user : userReducer,
        order: orderReducer
})

const persistedReducer = persistReducer(persistConfig , rootReducer)

export const store = configureStore({
    reducer : persistedReducer,
        middleware : (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck:{
            ignoreActions : [FLUSH , REHYDRATE , PAUSE , PERSIST , PURGE , REGISTER],
            },

        })
    })

export let persistor = persistStore(store)
