import { createStore } from 'redux';

const initialState = {
  currentUser: {},
  token: '',
  socket: null,
  
};

function reducer( state=initialState, action ){

  console.log('reducer state', state);
  switch( action.type ){

    case 'currentUser/login':
      return {
        ...state,
        currentUser: action.payload[0].user,
        token: action.payload[0].token,
        socket: action.payload[1]
      };

    case 'currentUser/logout':
      return {
        ...state,
        currentUser: {},
        token: '',
        socket: null
      };

    case 'socketIO/connect':
      return {
        ...state,
        socket: action.payload
      }
      
    case 'socketIORoom/connect':
      return {
        ...state,
        socketRoom: action.payload
      }

    default:

      return state;

  } // switch

} // reducer()


export const store = createStore(
  reducer, 
  {token: localStorage.getItem('jwt'), currentUser: 
  localStorage.getItem('currentUser')},
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