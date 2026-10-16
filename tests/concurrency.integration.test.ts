import {afterAll,beforeAll,describe,expect,it} from 'vitest';
import {PrismaClient} from '@prisma/client';

const enabled=Boolean(process.env.DATABASE_URL&&process.env.RUN_DB_CONCURRENCY==='true');
const prisma=new PrismaClient();
const key=`race-${Date.now()}`;
let bedId='',guestId='';

describe.skipIf(!enabled)('Postgres booking concurrency',()=>{
  beforeAll(async()=>{
    const guest=await prisma.user.create({data:{email:`${key}@test.invalid`,name:'Race Test Guest'}});guestId=guest.id;
    const hostel=await prisma.hostel.create({data:{slug:key,name:'Race Test Hostel',area:'Test',address:'Test, Hyderabad',description:'Test fixture',genderPolicy:'Co-ed',latitude:17.4,longitude:78.4,coverImage:'https://example.invalid/test.jpg',amenities:[],verificationStatus:'approved'}});
    const room=await prisma.room.create({data:{hostelId:hostel.id,type:'single',label:'Test bed',priceNight:100,priceMonth:1000,totalBeds:1}});
    const bed=await prisma.bed.create({data:{roomId:room.id}});bedId=bed.id;
  });
  afterAll(async()=>{
    if(bedId)await prisma.booking.deleteMany({where:{bedId}});
    await prisma.hostel.deleteMany({where:{slug:key}});
    if(guestId)await prisma.user.delete({where:{id:guestId}});
    await prisma.$disconnect();
  });
  it('allows only one simultaneous hold for one bed and date range',async()=>{
    const startDate=new Date('2032-06-01T00:00:00.000Z'),endDate=new Date('2032-06-08T00:00:00.000Z');
    const claim=()=>prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM "Bed" WHERE id = ${bedId} FOR UPDATE`;
      const overlap=await tx.booking.findFirst({where:{bedId,startDate:{lt:endDate},endDate:{gt:startDate},OR:[{status:{in:['confirmed','checked_in']}},{status:'held',holdExpiresAt:{gt:new Date()}}]}});
      if(overlap)throw new Error('BED_UNAVAILABLE');
      return tx.booking.create({data:{bedId,guestId,startDate,endDate,amount:1000,status:'held',holdExpiresAt:new Date(Date.now()+600_000)}});
    });
    const results=await Promise.allSettled([claim(),claim()]);
    expect(results.filter(r=>r.status==='fulfilled')).toHaveLength(1);
    expect(await prisma.booking.count({where:{bedId}})).toBe(1);
  });
});
