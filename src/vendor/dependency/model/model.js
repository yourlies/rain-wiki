//加载依赖模块
import modelConfig from '../../../config/model';
/*
 * @description: load加载类，加载博客模型类
 * @author: 因雨而生
 * @update: 因雨而生 (2016-10-21 15:32)
 */
class Model {
    constructor () {
        ::this.loadModels; ::this.addSubscription; ::this.addBubbles;
        this.initialize();
        this.loadModels();
        this.addSubscription();
        this.addBubbles();
    }

    initialize () {
        this.config = modelConfig;
        this.models = this.config.models; this.delegation = {};
        this.subscriber = {}; this.subscription = {};
        this.delegation.config = modelConfig;
    }

    loadModels () {
        for (let i = 0; i < this.models.length; i++) {
            const model = this.models[i];
            this.subscriber[model] = require('../../../model/' + model)['default'];
        }
    }

    addSubscription () {
        for (let subscription in this.config.subscriptions) {
            for (let model in this.config.subscriptions[subscription]) {
                const method = this.config.subscriptions[subscription][model];
                const callback = this.subscriber[model][method];
                if (!this.subscription.hasOwnProperty(subscription)) {
                    this.subscription[subscription] = [];
                }
                this.subscription[subscription].push(callback);
            }
        }
        const subscription = (subscription) => {
            const subscribers = {};
            if (this.subscription.hasOwnProperty(subscription)) {
                for (let i = 0; i < this.subscription[subscription].length; i++) {
                    subscribers[`subscriber${i}`] = false;
                }
            }
            return subscribers;
        };
        this.delegation.subscription = subscription;
    }

    addBubbles () {
        const bubble = (subscription, page, component, id) => {
            // if (component.failed.length == 0) {
            //     component.failed.push({ subscription, page, component, id, handle: false });
            // }
            // for (let i = 0; i < component.failed.length; i++) {
            //     if (component.failed[i].id == id) {
            //         break;
            //     }
            //     if (i == component.failed.length - 1) {
            //         component.failed.push({ subscription, page, component, id, handle: false });
            //     }
            // }
            if (this.subscription.hasOwnProperty(subscription)) {
                for (let i = 0; i < this.subscription[subscription].length; i++) {
                    const eventId = {};
                    eventId.name = subscription;
                    eventId.subscription = id;
                    eventId.subscriber = i;
                    eventId.name = subscription;
                    this.subscription[subscription][i](page, component, eventId);
                }
                // for (let j = 0; j < component.failed.length; j++) {
                //     if (component.failed[j].subscription == subscription
                //         && id == component.failed[j].id) {
                //         component.failed[j].handle = true;
                //     }
                // }
            }
        };
        this.delegation.bubble = bubble;
    }
}

const model = new Model();
export default model.delegation;