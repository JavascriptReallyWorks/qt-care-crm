
module.exports = agent => {

    agent.messenger.on('egg-ready', () => {
        // 指派某一worker执行清理
        agent.messenger.sendRandom('initialClean',{});
    });


    class ClusterStrategy extends agent.ScheduleStrategy {
        start() {
            // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
            // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
            agent.mq.subscribe(schedule.scene, () => this.sendOne());
        }
    }
    agent.schedule.use('cluster', ClusterStrategy);
};
