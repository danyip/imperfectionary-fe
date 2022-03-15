import { createStore } from 'redux';

const initialState = {
  currentUser: {},
  token: ''
};

function reducer( state=initialState, action ){

  switch( action.type ){

    case 'currentUser/login':
      return {
        ...state,
        currentUser: action.payload.user,
        token: action.payload.token
      };

    case 'currentUser/logout':
      return {
        ...state,
        currentUser: {},
        token: ''
      }

    default:

      return state;

  } // switch

} // reducer()


export const store = createStore(
  reducer, 
  {token: localStorage.getItem('jwt')},
  // optional argument here: initial state value, perhaps from localStorage or DB?
  // might need to merge with the above 'initialState' object?
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({trace: true})
);

store.subscribe( () => {
  const state = store.getState();
  localStorage.setItem('jwt', state.token);
  localStorage.setItem('currentUser', state.currentUser);
  console.log('Redux update:', state);
})