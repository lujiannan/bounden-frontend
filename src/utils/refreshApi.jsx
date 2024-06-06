import createRefresh from 'react-auth-kit/createRefresh';
import axios from 'axios';

const refreshApi = createRefresh({
    interval: 0.1, // The time in minutes to refresh the Access token (1439 = 23.59 hrs)
    refreshApiCallback: async (param) => {
        // param contructor: { refreshToken: string, authToken: string, authUserState: {} }
        console.log(param)
        try {
            const response = await axios.post("/token/refresh", param, {
                headers: { 'Authorization': `Bearer ${param.refreshToken}` }
            })
            console.log(response)
            console.log("Refreshing")
            return {
                isSuccess: true,
                newAuthToken: response.data.access_token,
                // newAuthTokenExpireIn: 5, // in minutes
                // newRefreshTokenExpiresIn: 43200 // in minutes
            }
        }
        catch (error) {
            console.error(error)
            return {
                isSuccess: false
            }
        }
    }
})

export default refreshApi