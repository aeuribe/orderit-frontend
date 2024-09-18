import axios from "axios"

const baseUrl = 'http://localhost:32780/api/authentication/login'

const login =  async credencials => {
    const {data} = await axios.post(baseUrl, credencials)
    return data

}

export default {login}