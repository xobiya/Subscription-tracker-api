import create from 'zustand'

export const useStore = create((set)=>({
  user: null,
  token: null,
  setAuth: (user, token) => set(()=>({user, token})),
  clearAuth: ()=> set(()=>({user:null, token:null}))
}))
