import axios from 'axios';

export const callApi = (method = 'GET', url ) => {
     axios({
         method: method,
         url: url,
         proxy: {
             port: 8000
         }
     }).then(function(response) {
        return response;
     })
}