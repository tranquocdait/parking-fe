import UserRepository from './UserRepository'
import QRCodeRepository from './QRCodeRepository'
import ParkingManagement from './ParkingManagement'
import TicketManagement from './TicketManagement'
import PaymentManagement from './PaymentManagement'
import CheckingRepository from './CheckingRepository'

const repositories = {
    user: UserRepository,
    qr_code: QRCodeRepository,
    parking: ParkingManagement,
    ticket: TicketManagement,
    payment: PaymentManagement,
    checking: CheckingRepository,
};

export default {
    get: name => repositories[name]
};