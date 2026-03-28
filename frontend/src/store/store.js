import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import candidateReducer from './slices/candidateSlice'
import interviewReducer from './slices/interviewSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['candidate', 'interview'] // only persist these
}

const store = configureStore({
  reducer: {
    candidate: persistReducer(persistConfig, candidateReducer),
    interview: persistReducer(persistConfig, interviewReducer),
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export const persistor = persistStore(store)
export default store
