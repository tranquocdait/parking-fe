import UserRepository from './UserRepository'
const repositories = {
    user: UserRepository,
};

export default {
    get: name => repositories[name]
};