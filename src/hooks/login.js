import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:9090';

export function useLoginUser( email, password){

  const [resultPhotos, setResultPhotos] = useState(null);
  const [loading, setLoading] = useState( true );
  const [error, setError] = useState( null );

  useEffect(
    () => createLogin( email, password ),
    [email, password]
  );

  async function createLogin( email, password ){

    setLoading( true );

    const url = `${BASE_URL}/login`

    try {
      const res = await axios.post( url, {email: email, password: password} );
      console.log('response', res.data);
      
      setResultPhotos( res.data );
      setLoading( false );
    
    } catch( err ){
    
      console.log('Error in login', err);
        setError( err );
        setLoading( false );
    }

  }

  return  { resultPhotos, loading, error };

}

