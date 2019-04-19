module.exports = app => {
  class ServiceOrder extends app.Service {
    async jdyNotif(body){
      const {ctx, service} = this;
      try{
        const {data, op} = body;
        if(['data_create', 'data_update'].includes(op)){    // all : ['data_create', 'data_update', 'data_remove']
          const {
            _id, // to ignore
            service_number,  // db query
            service_name,
            appId,
            entryId,
            member_id,
            order_id,
            mr_id,
            service_events,
          } = data; 

          const updates = {
            service_name,
            appId,
            entryId,
            member_id,
            order_id,
            mr_id,
            service_events: service_events.map(event => ({
              ...event,
              event_date: event.event_date ? event.event_date.split('T')[0] : '',
            })),
          }
          await this.ctx.model.ServiceOrder.findOneAndUpdate({ service_number }, { $set: updates }, { upsert: true});
        } 
      }
      catch(err){
        ctx.error('service.serviceOrder.jdyNotif error', err);
      }
    }
  }
  return ServiceOrder;
};
