import { useNavigate } from "react-router";

export const getUserData = () => {
    try {
        const storedData = localStorage.getItem('user_profile');
        console.log("getUserData ~ storedData:", storedData)
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
    }
};



export const logoutUser = (navigate) => {

    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
    navigate('/login');
}