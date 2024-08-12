using {app.train} from '../db/schema';

service hanaservices {

    entity Users    as projection on train.Users;
    entity Trains   as projection on train.Trains;
    entity Bookings as projection on train.Bookings;
}
