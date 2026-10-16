export type Hostel = {slug:string; name:string; area:string; price:number; monthly:number; rating:number; reviews:number; gender:string; food:boolean; verified:boolean; image:string; tag:string; distance?:string; amenities:string[]};
const photos=['photo-1555854877-bab0e564b8d5','photo-1522708323590-d24dbb6b0267','photo-1564013799919-ab600027ffc6','photo-1590490360182-c33d57733427','photo-1522771739844-6a9f6d5f14af','photo-1560185008-b033106af5c3'];
const hostelRows:[string,string,string,number,number,number,number,string,boolean,boolean,string,string,string[]][]=[
['the-nest-kondapur','The Nest', 'Kondapur',890,14900,4.8,126,'Co-ed',true,true,'Popular','1.2 km',['Wi-Fi','Meals','Laundry','AC']],
['urban-den-madhapur','Urban Den','Madhapur',1050,17900,4.7,98,'Boys',true,true,'Top rated','2.4 km',['Wi-Fi','Gym','Meals','AC']],
['olive-house-gachibowli','Olive House','Gachibowli',1250,21500,4.9,84,'Girls',true,true,'Verified pick','0.8 km',['Wi-Fi','Meals','Laundry','Security']],
['common-ground-hitec','Common Ground','HITEC City',950,16500,4.6,71,'Co-ed',false,true,'Great value','1.7 km',['Wi-Fi','AC','Security']],
['saffron-stays-ameerpet','Saffron Stays','Ameerpet',680,11200,4.5,62,'Girls',true,true,'Student favourite','3.1 km',['Wi-Fi','Meals','Laundry']],
['metro-house-begumpet','Metro House','Begumpet',750,12900,4.4,53,'Boys',true,true,'Near transit','2.2 km',['Wi-Fi','Meals','Security']],
['blue-door-jubilee','Blue Door Living','Jubilee Hills',1450,24900,4.9,47,'Co-ed',true,true,'Premium','1.1 km',['Wi-Fi','Gym','Meals','AC']],
['campus-cove-miyapur','Campus Cove','Miyapur',620,9900,4.3,39,'Boys',true,false,'New listing','4.5 km',['Wi-Fi','Meals','Security']],
['the-huddle-kukatpally','The Huddle','Kukatpally',720,11900,4.6,58,'Co-ed',true,true,'Popular','1.4 km',['Wi-Fi','Meals','Laundry']],
['mint-house-narsingi','Mint House','Narsingi',980,16900,4.7,33,'Girls',false,true,'Quiet stay','2.0 km',['Wi-Fi','AC','Security']],
['terrace-living-manikonda','Terrace Living','Manikonda',850,14500,4.5,42,'Co-ed',true,true,'Verified pick','1.8 km',['Wi-Fi','Meals','Laundry']],
['stay-social-tolichowki','Stay Social','Tolichowki',590,9500,4.2,27,'Boys',true,true,'Budget pick','2.8 km',['Wi-Fi','Meals']],
];
export const hostels:Hostel[]=hostelRows.map((a,i)=>({slug:a[0],name:a[1],area:a[2],price:a[3],monthly:a[4],rating:a[5],reviews:a[6],gender:a[7],food:a[8],verified:a[9],tag:a[10],distance:a[11],amenities:a[12],image:`https://images.unsplash.com/${photos[i%photos.length]}?auto=format&fit=crop&w=900&q=80`}));
export const colleges=['University of Hyderabad','IIIT Hyderabad','IIT Hyderabad','JNTU Hyderabad','Osmania University','NIFT Hyderabad','ISB Hyderabad','BITS Pilani Hyderabad','CBIT','University College of Engineering, Osmania','VNR VJIET','GITAM Hyderabad','Woxsen University','Malla Reddy University','Anurag University'].map((name,i)=>({name,area:['Gachibowli','Gachibowli','Kandi','Kukatpally','Osmania','Madhapur','Gachibowli','Shameerpet','Gandipet','Osmania','Bachupally','Rudraram','Kamkole','Maisammaguda','Venkatapur'][i]}));
