import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
const colleges: [string,string][] = [['University of Hyderabad','Gachibowli'],['IIIT Hyderabad','Gachibowli'],['IIT Hyderabad','Kandi'],['JNTU Hyderabad','Kukatpally'],['Osmania University','Osmania'],['NIFT Hyderabad','Madhapur'],['ISB Hyderabad','Gachibowli'],['BITS Pilani Hyderabad','Shameerpet'],['CBIT','Gandipet'],['UCE Osmania','Osmania'],['VNR VJIET','Bachupally'],['GITAM Hyderabad','Rudraram'],['Woxsen University','Kamkole'],['Malla Reddy University','Maisammaguda'],['Anurag University','Venkatapur']];
const areas=['Kondapur','Madhapur','Gachibowli','HITEC City','Ameerpet','Begumpet','Jubilee Hills','Miyapur','Kukatpally','Narsingi','Manikonda','Tolichowki','Bachupally','Gandipet','Osmania','Shameerpet','Kompally','Hafeezpet','KPHB','Raidurg','Masab Tank','Sainikpuri','Nacharam','Kokapet','Financial District'];
const titles=['The Nest','Urban Den','Olive House','Common Ground','Saffron Stays','Metro House','Blue Door Living','Campus Cove','The Huddle','Mint House','Terrace Living','Stay Social'];
const genders=['Co-ed','Boys','Girls'];
async function main(){
 for(let i=0;i<colleges.length;i++){const [name,area]=colleges[i];await prisma.college.upsert({where:{name},update:{area},create:{name,area,latitude:17.38+(i%5)*.018,longitude:78.38+(i%6)*.019}})}
 const guest=await prisma.user.upsert({where:{email:'guest@toghar.in'},update:{},create:{email:'guest@toghar.in',name:'Demo Guest',role:Role.guest}});
 await prisma.user.upsert({where:{email:'owner@toghar.in'},update:{},create:{email:'owner@toghar.in',name:'Asha Owner',role:Role.owner}});
 await prisma.user.upsert({where:{email:'admin@toghar.in'},update:{},create:{email:'admin@toghar.in',name:'Toghar Admin',role:Role.admin}});
 for(let i=0;i<areas.length;i++){
  const slug=titles[i%titles.length].toLowerCase().replaceAll(' ','-')+'-'+areas[i].toLowerCase().replaceAll(' ','-');
  const name=titles[i%titles.length]+(i>=titles.length?' '+areas[i]:'');
  const hostel=await prisma.hostel.upsert({where:{slug},update:{},create:{slug,name,area:areas[i],address:areas[i]+', Hyderabad, Telangana',description:'A welcoming, well managed stay with thoughtful shared spaces and a friendly resident community.',genderPolicy:genders[i%3],foodIncluded:i%4!==1,foodDetails:i%4!==1?'Breakfast and dinner available':'Meal plans available separately',verified:i<20,verificationStatus:i<20?'approved':'pending',latitude:17.36+(i%7)*.021,longitude:78.37+(i%8)*.019,coverImage:'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',amenities:['Wi-Fi','Meals','Laundry','Security','AC']}});
  for(let j=0;j<2;j++){const room=await prisma.room.create({data:{hostelId:hostel.id,type:j?'2 sharing':'4 sharing',label:j?'Twin room':'Bunk room',priceNight:650+i*35+j*270,priceMonth:9500+i*440+j*4200,minMonths:1,deposit:4500+i*200,totalBeds:j?4:8}});for(let b=0;b<room.totalBeds;b++)await prisma.bed.create({data:{roomId:room.id}})}
  if(i<3){const bed=await prisma.bed.findFirst({where:{room:{hostelId:hostel.id}}});if(bed){const key='seed-'+slug;await prisma.booking.upsert({where:{idempotencyKey:key},update:{},create:{bedId:bed.id,guestId:guest.id,status:'completed',startDate:new Date('2026-03-01T00:00:00Z'),endDate:new Date('2026-03-30T00:00:00Z'),amount:14900,deposit:4500,idempotencyKey:key}});const reviewId='seed-review-'+slug;await prisma.review.upsert({where:{id:reviewId},update:{},create:{id:reviewId,hostelId:hostel.id,guestId:guest.id,cleanliness:5,safety:5,food:4,value:5,comment:'A warm welcome and a comfortable place to settle in.'}})}}
 }
 console.log('Seeded '+colleges.length+' colleges, '+areas.length+' hostels, demo users, bookings, and reviews.');
}
main().finally(()=>prisma.$disconnect());
