import Repository from './Repository';

const resource = '/users'

export default {
    async post(payload, subUrl) {
        return await Repository.post(`${resource}/${subUrl}`, payload);
    }
}