module.exports = app => {
  class Order extends app.Service {
    async jdyNotif(body){
      const {ctx, service} = this;
      try{
        const {data, op} = body;
        if(['data_create', 'data_update'].includes(op)){    // all : ['data_create', 'data_update', 'data_remove']
          const {
            _id, // to ignore
            order_id,  // db query
            order_status,  // to change 
            applicant_birth,  // to change
            insured_birth,  // to change
            insurance_apply_date,  // to change
            insurance_start_date,  // to change
            insurance_end_date,  // to change
            payments, // to change
            services, // to change
            ...remain} = data; 

          const updates = {
            ...remain,
            order_status: order_status === '终止' ? 4 : 1,
            applicant_birth: applicant_birth ? applicant_birth.split('T')[0] : '',
            insured_birth: insured_birth ? insured_birth.split('T')[0] : '',
            insurance_apply_date: insurance_apply_date ? insurance_apply_date.split('T')[0] : '',
            insurance_start_date: insurance_start_date ? insurance_start_date.split('T')[0] : '',
            insurance_end_date: insurance_end_date ? insurance_end_date.split('T')[0] : '',
            payments : payments.map(payment => ({
              ...payment,
              payment_date: payment.payment_date ? payment.payment_date.split('T')[0] : '',
            })),
            services : services.map(service => ({
              ...service,
              start_date: service.start_date ? service.start_date.split('T')[0] : '',
              end_date: service.end_date ? service.end_date.split('T')[0] : '',
            })),
          }
          
          await this.ctx.model.Order.findOneAndUpdate({ order_id }, { $set: updates }, { upsert: true});
        } 
      }
      catch(err){
        ctx.error('service.order.jdyNotif error', err);
      }
    }
  }
  return Order;
};
