import Repository from './Repository';

const resource = '/checking'

export default {
    async get(subUrl) {
        return await Repository.get(`${resource}/${subUrl}`, { headers: {
            "Authorization": localStorage.getItem('token')
        }});
    }
}