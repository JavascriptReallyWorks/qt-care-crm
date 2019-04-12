module.exports = app => {
  class Member extends app.Service {
    async jdyNotif(body){
      const {ctx, service} = this;
      try{
        const {data, op} = body;
        if(['data_create', 'data_update'].includes(op)){    // all : ['data_create', 'data_update', 'data_remove']
          const {
            _id, // to ignore
            member_id,  // db query
            gender,  // to change
            orders,  // to change 
            birth_date,  // to change
            ...remain} = data; 

          const updates = {
            ...remain,
            gender: gender === '男' ? 0 : 1,
            birth_date: birth_date ? birth_date.split('T')[0] : '',
            orders: orders.map(order => ({
              ...orders,
              order_status: order.order_status === '承保' ? 1 : 4,
              insurance_start_date: order.insurance_start_date ? insurance_start_date.split('T')[0] : '',
              insurance_end_date: order.insurance_end_date ? insurance_end_date.split('T')[0] : '',
            })),
          }
          await this.ctx.model.Member.findOneAndUpdate({ member_id }, { $set: updates }, { upsert: true});
        } 
      }
      catch(err){
        ctx.error('service.member.jdyNotif error', err);
      }
    }
  }
  return Member;
};
