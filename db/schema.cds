namespace app.train;

entity Users {
    key uid      : Integer;
        username : String;
        email    : String;
        phone    : String;
        password : String;
        access    : String;
}

entity Trains {
    key trainCode          : Integer;
        trainName          : String;
        sourceStation      : String;
        destinationStation : String;
        srcDepartureTime   : String;
        dstnArrivalTime    : String;
        seatingCapacity    : Integer;
        ticketPrice        : Integer;
}

entity Bookings {
    key id                 : Integer;
    key uid                : Integer;
        username           : String;
    key trainCode          : Integer;
        trainName          : String;
    
        noOfSeatsBooked    : Integer;
        sourceStation      : String;
        destinationStation : String;
}
