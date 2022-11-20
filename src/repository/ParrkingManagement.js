import Repository from './Repository';

const resource = '/parking'

export default {
    async post(params, subUrl) {
        return await Repository.post(`${resource}/${subUrl}`, params, { headers: {
            "Authorization": localStorage.getItem('token')
        }});
    }
}