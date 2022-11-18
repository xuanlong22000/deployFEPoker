import jwt_decode from 'jwt-decode';

const jwtUtils = {
  decodeJwt(token) {
    try {
      return jwt_decode(token);
    } catch (e) {
      return null;
    }
  }
}

export default jwtUtils; 