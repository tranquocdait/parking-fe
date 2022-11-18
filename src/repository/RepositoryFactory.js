import UserRepository from './UserRepository'
import QRCodeRepository from './QRCodeRepository'
const repositories = {
    user: UserRepository,
    qr_code: QRCodeRepository,
};

export default {
    get: name => repositories[name]
};