import axios from "axios";

const baseDomain = "https://parking-management-whet.onrender.com";
const baseURL = `${baseDomain}/`

export default axios.create({
    baseURL,
    header: {
        "Authorization": localStorage.getItem('token')
    }
})