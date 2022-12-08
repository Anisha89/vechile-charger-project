import { GeoLocation } from './geolocation.model';

export class Facility {
    id: string;
    name: string;
    address: string;
    location: GeoLocation;
    timeZone: string;
    type: string;
    status: string;
    picture: string;
    organizationId: string;
    organizationName: string;
    createdBy: string;
    createdOn: Date;
    geoFrom:string;
    geoTo:string;

  
    static  getplace(place:string) {
        switch(place) {
              case "chennai":
                 return '13.067439:80.237617'
              break;
              case "bangalore":
                  return '12.972442:77.580643'
               break;
               default:
                   return '00.00000:00.00000'
             
              }
       
      }


    
}


  


