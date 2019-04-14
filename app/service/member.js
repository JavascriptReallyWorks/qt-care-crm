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
            orders,  // to change 
            birth,  // to change
            ...remain} = data; 

          const updates = {
            ...remain,
            birth: birth ? birth.split('T')[0] : '',
            orders: orders.map(order => ({
              ...order,
              order_status: order.order_status === '终止' ? 4 : 1,
              insurance_start_date: order.insurance_start_date ? order.insurance_start_date.split('T')[0] : '',
              insurance_end_date: order.insurance_end_date ? order.insurance_end_date.split('T')[0] : '',
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
