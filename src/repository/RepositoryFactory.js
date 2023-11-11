import UserRepository from './UserRepository'
import QRCodeRepository from './QRCodeRepository'
import ParkingManagement from './ParkingManagement'
import TicketManagement from './TicketManagement'
import PaymentManagement from './PaymentManagement'

const repositories = {
    user: UserRepository,
    qr_code: QRCodeRepository,
    parking: ParkingManagement,
    ticket: TicketManagement,
    payment: PaymentManagement,
};

export default {
    get: name => repositories[name]
};